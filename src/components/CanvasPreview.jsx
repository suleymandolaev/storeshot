import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, AlignCenterVertical, AlignCenterHorizontal, Star } from 'lucide-react';
import { Rnd } from 'react-rnd';

export default function CanvasPreview({ config, setConfig, elements, setElements }) {
    const screenshotRef = useRef(null);
    const [guideLines, setGuideLines] = useState({ v: false, h: false });

    // Ensure gradient background
    const bgStyle = {
        background: `linear-gradient(145deg, ${config.backgroundColor || '#0a0a0a'} 0%, ${config.backgroundColor2 || '#1a1a1a'} 100%)`
    };

    const deviceSpecs = {
        'iphone-65': {
            canvasW: 428,
            canvasH: 926,
            aspect: '1284 / 2778',
            radiusCenter: '44px',
            radiusEdge: '44px 44px 0 0',
            border: '14px',
            island: true,
            classic: false,
            android: false
        },
        'iphone-55': {
            canvasW: 414,
            canvasH: 736,
            aspect: '1242 / 2208',
            radiusCenter: '40px',
            radiusEdge: '40px 40px 0 0',
            border: '12px',
            island: false,
            classic: true,
            android: false
        },
        'ipad-pro': {
            canvasW: 512,
            canvasH: 683,
            aspect: '2048 / 2732',
            radiusCenter: '18px',
            radiusEdge: '18px 18px 0 0',
            border: '12px',
            island: false,
            classic: false,
            android: false
        },
        'galaxy-a15': {
            canvasW: 360,
            canvasH: 780,
            aspect: '1080 / 2340',
            radiusCenter: '36px',
            radiusEdge: '36px 36px 0 0',
            border: '10px',
            island: false,
            classic: false,
            android: true,
            punchHole: true
        }
    };

    const activeSpec = deviceSpecs[config.deviceType] || deviceSpecs['iphone-65'];

    const handleExport = async () => {
        console.log("Export button clicked! screenshotRef.current is:", screenshotRef.current);
        if (!screenshotRef.current) {
            console.error("screenshotRef is null! Cannot export.");
            return;
        }
        try {
            console.log("Starting export process...");
            // Small timeout to ensure DOM is fully ready
            await new Promise(r => setTimeout(r, 100));

            // Calculate the dimensions & scale factor depending on deviceType
            // Default to iPhone 6.5" max
            let targetWidth = 1284;
            let targetHeight = 2778;

            if (config.deviceType === 'ipad-pro') {
                targetWidth = 2048;
                targetHeight = 2732;
            } else if (config.deviceType === 'iphone-55') {
                targetWidth = 1242;
                targetHeight = 2208;
            } else if (config.deviceType === 'galaxy-a15') {
                // Google Play Store recommended phone screenshot size
                targetWidth = 1080;
                targetHeight = 2340;
            }

            // Force scaling factor using mathematical integers rather than DOM dimensions
            // to avoid subpixel layout shifts or rounding rounding fractional dimensions
            const scale = targetWidth / activeSpec.canvasW;
            console.log("Scale calculated:", scale, "Dimensions:", targetWidth, targetHeight);

            console.log("Calling toPng...");
            const dataUrl = await toPng(screenshotRef.current, {
                quality: 1,
                pixelRatio: scale,
                width: activeSpec.canvasW,
                height: activeSpec.canvasH,
                cacheBust: true,
                skipAutoScale: true,
            });
            console.log("toPng finished! DataURL length:", dataUrl.length);

            const link = document.createElement('a');
            link.download = `storeshot-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            console.log("Download triggered.");
        } catch (err) {
            console.error('Failed to export screenshot', err);
        }
    };

    return (
        <main className="canvas-area">
            <div className="top-bar">
                <button className="btn-primary" onClick={handleExport}>
                    <Download size={18} />
                    Export Screenshot
                </button>
            </div>

            <div className="canvas-container" style={{ alignItems: config.deviceType === 'ipad-pro' ? 'center' : 'center' }}>
                {/* The target proportion container */}
                <div
                    className="screenshot-preview"
                    ref={screenshotRef}
                    style={{
                        ...bgStyle,
                        width: `${activeSpec.canvasW}px`,
                        height: `${activeSpec.canvasH}px`,
                        position: 'relative',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}
                >
                    {/* Snap Guide Lines */}
                    {guideLines.v && (
                        <div style={{
                            position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px',
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                            zIndex: 50, transform: 'translateX(-50%)', pointerEvents: 'none'
                        }} />
                    )}

                    {/* Dynamic Draggable Elements */}
                    {elements.map((el) => {
                        const isBadge = el.type === 'badge';
                        return (
                            <Rnd
                                key={el.id}
                                bounds="parent"
                                position={{ x: el.x, y: el.y }}
                                onDrag={(e, d) => {
                                    // Snapping Logic
                                    const containerWidth = screenshotRef.current.offsetWidth;
                                    const centerX = containerWidth / 2;
                                    const elCenterX = d.x + (e.target.offsetWidth / 2 || 100); // approx center

                                    // If near center
                                    if (Math.abs(elCenterX - centerX) < 15) {
                                        setGuideLines({ v: true, h: false });
                                    } else {
                                        setGuideLines({ v: false, h: false });
                                    }
                                }}
                                onDragStop={(e, d) => {
                                    let finalX = d.x;
                                    const containerWidth = screenshotRef.current.offsetWidth;
                                    const centerX = containerWidth / 2;

                                    // Calculate actual element width safely
                                    const elNode = document.getElementById(`rnd-${el.id}`);
                                    const elWidth = elNode ? elNode.offsetWidth : 200;

                                    // Snap to center if close
                                    if (Math.abs((d.x + elWidth / 2) - centerX) < 15) {
                                        finalX = centerX - (elWidth / 2);
                                    }

                                    setElements(elements.map(item => item.id === el.id ? { ...item, x: finalX, y: d.y } : item));
                                    setGuideLines({ v: false, h: false });
                                }}
                                enableResizing={false}
                                style={{ zIndex: 20 }}
                            >
                                <div
                                    id={`rnd-${el.id}`}
                                    style={el.type === 'image' ? {
                                        width: `${el.width || 150}px`,
                                        height: 'auto',
                                        cursor: 'grab',
                                        display: 'flex',
                                        filter: el.hasShadow !== false ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' : 'none'
                                    } : {
                                        color: el.color,
                                        fontSize: `${el.fontSize}px`,
                                        fontWeight: el.fontWeight,
                                        fontFamily: config.fontFamily,
                                        letterSpacing: '-0.03em',
                                        lineHeight: el.type === 'testimonial' ? 1.4 : 1.1,
                                        whiteSpace: 'pre-wrap',
                                        padding: isBadge ? '8px 20px' : (el.type === 'testimonial' ? '16px 24px' : '0'),
                                        backgroundColor: isBadge || el.type === 'testimonial' ? el.backgroundColor : 'rgba(0,0,0,0)',
                                        borderRadius: isBadge ? '9999px' : (el.type === 'testimonial' ? '16px' : '0'),
                                        boxShadow: (isBadge || el.type === 'testimonial') && el.backgroundColor !== 'rgba(0,0,0,0)' && el.backgroundColor !== 'transparent' ? '0 12px 40px rgba(0,0,0,0.1)' : 'none',
                                        border: (isBadge || el.type === 'testimonial') && el.backgroundColor !== 'rgba(0,0,0,0)' && el.backgroundColor !== 'transparent' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                        backdropFilter: el.type === 'testimonial' ? 'blur(16px)' : 'none',
                                        WebkitBackdropFilter: el.type === 'testimonial' ? 'blur(16px)' : 'none',
                                        cursor: 'grab',
                                        maxWidth: el.type === 'testimonial' ? '300px' : 'auto'
                                    }}
                                >
                                    {el.type === 'image' ? (
                                        el.src ? <img src={el.src} alt="floating graphic" style={{ width: '100%', height: 'auto', pointerEvents: 'none', borderRadius: `${el.borderRadius ?? 12}px` }} /> :
                                            <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: `${el.borderRadius ?? 12}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px' }}>No Image</div>
                                    ) : el.type === 'testimonial' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} size={14} fill={i < (el.rating || 5) ? "#FACC15" : "none"} color={i < (el.rating || 5) ? "#FACC15" : "rgba(255,255,255,0.3)"} />
                                                ))}
                                            </div>
                                            <div style={{ fontStyle: 'italic', fontSize: `${el.fontSize}px`, color: el.color }}>"{el.text}"</div>
                                            {el.author && <div style={{ fontSize: `${el.fontSize * 0.75}px`, opacity: 0.8, fontWeight: 500, color: el.color, marginTop: '4px' }}>— {el.author}</div>}
                                        </div>
                                    ) : (
                                        el.text
                                    )}
                                </div>
                            </Rnd>
                        );
                    })}

                    <div className="device-mockup" style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        display: 'flex',
                        alignItems: config.layout === 'center' ? 'center' : (config.layout === 'text-bottom' ? 'flex-start' : 'flex-end'),
                        justifyContent: 'center',
                        zIndex: 10,
                        pointerEvents: 'none' // allow dragging text over it
                    }}>
                        <div className={`device-frame frame-${config.deviceType}`} style={{
                            width: config.layout === 'center' ? '70%' : '82%',
                            height: 'auto',
                            aspectRatio: activeSpec.aspect,
                            borderWidth: activeSpec.border,
                            borderStyle: 'solid',
                            borderColor: '#111',
                            borderBottomWidth: config.layout === 'center' ? activeSpec.border : (config.layout === 'text-bottom' ? activeSpec.border : '0'),
                            borderTopWidth: config.layout === 'text-bottom' ? '0' : activeSpec.border,
                            borderRadius: config.layout === 'center' ? activeSpec.radiusCenter : (config.layout === 'text-bottom' ? '0 0 ' + activeSpec.radiusCenter.split(' ')[0] + ' ' + activeSpec.radiusCenter.split(' ')[0] : activeSpec.radiusEdge),
                            boxSizing: 'border-box',
                            position: 'relative',
                            pointerEvents: 'auto'
                        }}>
                            {activeSpec.island && <div className="dynamic-island"></div>}
                            {activeSpec.classic && <div className="classic-bezel-top"></div>}
                            {activeSpec.punchHole && <div className="punch-hole-camera"></div>}
                            {config.deviceType === 'ipad-pro' && (
                                <div style={{
                                    position: 'absolute', top: config.layout === 'text-bottom' ? 'auto' : '-11px', bottom: config.layout === 'text-bottom' ? '-11px' : 'auto', left: '50%', transform: 'translateX(-50%)',
                                    width: '6px', height: '6px', backgroundColor: '#1f1f1f', borderRadius: '50%', zIndex: 10,
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)'
                                }}></div>
                            )}
                            {config.appImage ? (
                                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit' }}>
                                    <Rnd
                                        bounds="parent"
                                        position={{ x: config.appImageX || 0, y: config.appImageY || 0 }}
                                        size={{ width: config.appImageWidth || '100%', height: config.appImageHeight || '100%' }}
                                        onDragStop={(e, d) => setConfig({ ...config, appImageX: d.x, appImageY: d.y })}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            setConfig({ ...config, appImageWidth: ref.style.width, appImageHeight: ref.style.height, appImageX: position.x, appImageY: position.y });
                                        }}
                                        enableResizing={true}
                                        style={{ display: 'flex' }}
                                    >
                                        <img src={config.appImage} alt="App Content" className="app-screen-image" style={{ width: '100%', height: '100%', objectFit: 'fill', borderRadius: '0', pointerEvents: 'none' }} />
                                    </Rnd>
                                </div>
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '600px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'var(--bg-surface-solid)',
                                    color: 'var(--text-tertiary)',
                                    padding: '24px',
                                    textAlign: 'center'
                                }}>
                                    Upload screenshot in the sidebar
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
