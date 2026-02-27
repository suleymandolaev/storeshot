import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, AlignCenterVertical, AlignCenterHorizontal } from 'lucide-react';
import { Rnd } from 'react-rnd';

export default function CanvasPreview({ config, elements, setElements }) {
    const screenshotRef = useRef(null);
    const [guideLines, setGuideLines] = useState({ v: false, h: false });

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
            console.log("Calculated dimensions. DOM Node width:", screenshotRef.current.offsetWidth);

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
            }

            // The actual node width in DOM, usually 400px (iphone) or scaled (ipad)
            const scale = targetWidth / screenshotRef.current.offsetWidth;
            console.log("Scale calculated:", scale);

            console.log("Calling toPng...");
            const dataUrl = await toPng(screenshotRef.current, {
                quality: 1,
                pixelRatio: scale,
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

    // Ensure gradient background
    const bgStyle = {
        background: `linear-gradient(145deg, ${config.backgroundColor || '#0a0a0a'} 0%, ${config.backgroundColor2 || '#1a1a1a'} 100%)`
    };

    // Set base preview dimensions proportionally 
    let previewWidth = '400px';
    let previewHeight = '865px'; // ~ iPhone 19.5:9

    if (config.deviceType === 'ipad-pro') {
        previewWidth = '600px';
        previewHeight = '800px'; // 4:3 iPad Ratio
    } else if (config.deviceType === 'iphone-55') {
        previewWidth = '400px';
        previewHeight = '711px'; // 16:9 classic iPhone
    }

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
                        width: previewWidth,
                        height: previewHeight,
                        position: 'relative'
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
                                    style={{
                                        color: el.color,
                                        fontSize: `${el.fontSize}px`,
                                        fontWeight: el.fontWeight,
                                        fontFamily: config.fontFamily,
                                        letterSpacing: '-0.03em',
                                        lineHeight: 1.1,
                                        whiteSpace: 'pre-wrap',
                                        padding: isBadge ? '8px 20px' : '0',
                                        backgroundColor: isBadge ? el.backgroundColor : 'rgba(0,0,0,0)',
                                        borderRadius: isBadge ? '9999px' : '0',
                                        boxShadow: isBadge && el.backgroundColor !== 'rgba(0,0,0,0)' && el.backgroundColor !== 'transparent' ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
                                        border: isBadge && el.backgroundColor !== 'rgba(0,0,0,0)' && el.backgroundColor !== 'transparent' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                        filter: isBadge ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'none',
                                        cursor: 'grab'
                                    }}
                                >
                                    {el.text}
                                </div>
                            </Rnd>
                        );
                    })}

                    <div className="device-mockup" style={{
                        marginTop: config.layout === 'text-bottom' ? 'auto' : (config.layout === 'center' ? 'auto' : '150px'),
                        width: '100%',
                        flex: 1,
                        display: 'flex',
                        alignItems: config.layout === 'center' ? 'center' : 'flex-end',
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: 0,
                        zIndex: 10,
                        pointerEvents: 'none' // allow dragging text over it
                    }}>
                        <div className={`device-frame frame-${config.deviceType}`} style={{
                            height: config.layout === 'center' ? '80%' : '85%',
                            width: config.deviceType === 'ipad-pro' ? '92%' : '85%',
                            borderWidth: config.deviceType === 'ipad-pro' ? '6px' : '4px',
                            borderRadius: config.deviceType === 'ipad-pro' ? '12px 12px 0 0' : '32px 32px 0 0'
                        }}>
                            {config.deviceType === 'iphone-65' && <div className="dynamic-island"></div>}
                            {config.deviceType === 'iphone-55' && <div className="classic-bezel-top"></div>}
                            {config.appImage ? (
                                <img src={config.appImage} alt="App Content" className="app-screen-image" style={{
                                    borderRadius: config.deviceType === 'ipad-pro' ? '6px 6px 0 0' : (config.deviceType === 'iphone-65' ? '28px 28px 0 0' : '0')
                                }} />
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
