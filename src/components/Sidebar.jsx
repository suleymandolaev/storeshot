import React from 'react';
import { Type, Image as ImageIcon, Layers, LayoutTemplate, MonitorSmartphone, PlusCircle, Trash2 } from 'lucide-react';

export default function Sidebar({ config, setConfig, elements, setElements }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setConfig((prev) => ({ ...prev, appImage: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addElement = (type) => {
        const newElement = {
            id: Date.now().toString(),
            type,
            text: type === 'testimonial' ? 'Absolutely life-changing app! 5 stars.' : (type === 'badge' ? 'New Badge' : (type === 'heading' ? 'New Text' : '')),
            author: type === 'testimonial' ? 'John Doe, Reviewer' : undefined,
            rating: type === 'testimonial' ? 5 : undefined,
            color: type === 'badge' ? '#000000' : '#ffffff',
            backgroundColor: type === 'badge' ? '#ffffff' : (type === 'testimonial' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0)'),
            fontSize: type === 'testimonial' ? 16 : (type === 'badge' ? 20 : 40),
            fontWeight: type === 'badge' || type === 'testimonial' ? 600 : 700,
            src: type === 'image' ? '' : undefined, // for custom floating images
            width: type === 'image' ? 150 : undefined,
            borderRadius: type === 'image' ? 12 : undefined,
            hasShadow: type === 'image' ? true : undefined,
            x: 32,
            y: 100,
        };
        setElements([...elements, newElement]);
    };

    const updateElement = (id, key, value) => {
        setElements(elements.map(el => el.id === id ? { ...el, [key]: value } : el));
    };

    const removeElement = (id) => {
        setElements(elements.filter(el => el.id !== id));
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <MonitorSmartphone size={24} color="var(--accent-primary)" />
                <h1>StoreShot</h1>
            </div>

            <div className="sidebar-content">
                {/* Dynamic Content Section */}
                {/* Canvas Elements Section */}
                <div className="section-card">
                    <div className="control-label" style={{ justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Type size={14} /> Elements
                        </span>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', width: '100%', marginTop: '6px' }}>
                            <button
                                className="btn-primary"
                                style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(255,255,255,0.1)' }}
                                onClick={() => addElement('heading')}
                                title="Add Text"
                            >
                                + Text
                            </button>
                            <button
                                className="btn-primary"
                                style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(59, 130, 246, 0.5)' }}
                                onClick={() => addElement('badge')}
                                title="Add Badge"
                            >
                                + Badge
                            </button>
                            <button
                                className="btn-primary"
                                style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(234, 179, 8, 0.5)' }}
                                onClick={() => addElement('testimonial')}
                                title="Add Testimonial"
                            >
                                + Review
                            </button>
                            <button
                                className="btn-primary"
                                style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(168, 85, 247, 0.5)' }}
                                onClick={() => addElement('image')}
                                title="Add Floating Image"
                            >
                                + Image
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {elements.map((el) => (
                            <div key={el.id} className="element-card">
                                <div className="element-card-header">
                                    <span className="element-type">{el.type}</span>
                                    <button
                                        className="btn-icon-danger"
                                        onClick={() => removeElement(el.id)}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                {/* Element Text/Content */}
                                {el.type !== 'image' && (
                                    <textarea
                                        value={el.text}
                                        onChange={(e) => updateElement(el.id, 'text', e.target.value)}
                                        className="control-input"
                                        style={{ marginBottom: el.type === 'testimonial' ? '4px' : '8px', fontSize: '12px' }}
                                        rows={2}
                                        placeholder={el.type === 'testimonial' ? "Quote..." : "Text..."}
                                    />
                                )}

                                {/* Specific Testimonial Controls */}
                                {el.type === 'testimonial' && (
                                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                        <input
                                            type="text"
                                            value={el.author}
                                            onChange={(e) => updateElement(el.id, 'author', e.target.value)}
                                            className="control-input"
                                            style={{ fontSize: '11px', flex: 2 }}
                                            placeholder="Author/Source"
                                        />
                                        <select
                                            value={el.rating}
                                            onChange={(e) => updateElement(el.id, 'rating', parseInt(e.target.value))}
                                            className="control-input"
                                            style={{ fontSize: '11px', flex: 1, padding: '4px' }}
                                        >
                                            <option value="5">5★</option>
                                            <option value="4">4★</option>
                                            <option value="3">3★</option>
                                            <option value="2">2★</option>
                                            <option value="1">1★</option>
                                        </select>
                                    </div>
                                )}

                                {/* Specific Image Controls */}
                                {el.type === 'image' && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <label style={{
                                            display: 'block',
                                            padding: '8px',
                                            textAlign: 'center',
                                            border: '1px dashed var(--border-focus)',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer',
                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                            fontSize: '11px',
                                            color: el.src ? 'var(--text-primary)' : 'var(--text-secondary)'
                                        }}>
                                            {el.src ? 'Image Loaded! (Click to replace)' : 'Click to Upload Custom Asset'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (event) => updateElement(el.id, 'src', event.target.result);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                )}

                                {/* Style Controls */}
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    {el.type !== 'image' && (
                                        <input
                                            type="color"
                                            value={el.color}
                                            onChange={(e) => updateElement(el.id, 'color', e.target.value)}
                                            className="color-picker"
                                            title="Text Color"
                                        />
                                    )}
                                    {(el.type === 'badge' || el.type === 'testimonial') && (
                                        <input
                                            type="color"
                                            value={el.backgroundColor !== 'rgba(0,0,0,0)' ? el.backgroundColor : '#ffffff'}
                                            onChange={(e) => updateElement(el.id, 'backgroundColor', e.target.value)}
                                            className="color-picker"
                                            title="Background Color"
                                        />
                                    )}
                                    {el.type !== 'image' && (
                                        <input
                                            type="number"
                                            value={el.fontSize}
                                            onChange={(e) => updateElement(el.id, 'fontSize', parseInt(e.target.value))}
                                            className="control-input"
                                            style={{ padding: '4px 8px', flex: '1' }}
                                            title="Font Size"
                                        />
                                    )}
                                    {el.type === 'image' && (
                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: '1 1 45%' }}>
                                                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Width</span>
                                                <input
                                                    type="number"
                                                    value={el.width}
                                                    onChange={(e) => updateElement(el.id, 'width', parseInt(e.target.value))}
                                                    className="control-input"
                                                    style={{ padding: '4px 8px', flex: '1' }}
                                                    title="Image Resize Width"
                                                />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: '1 1 45%' }}>
                                                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Radius</span>
                                                <input
                                                    type="number"
                                                    value={el.borderRadius}
                                                    onChange={(e) => updateElement(el.id, 'borderRadius', parseInt(e.target.value))}
                                                    className="control-input"
                                                    style={{ padding: '4px 8px', flex: '1' }}
                                                    title="Border Radius"
                                                />
                                            </div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', width: '100%' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={el.hasShadow !== false}
                                                    onChange={(e) => updateElement(el.id, 'hasShadow', e.target.checked)}
                                                    style={{ accentColor: 'var(--accent-primary)' }}
                                                />
                                                Drop Shadow
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {elements.length === 0 && (
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12px', padding: '16px 0' }}>
                                No elements added yet. Click + to add.
                            </div>
                        )}
                    </div>
                </div>
                {/* Global Design & Layout */}
                <div className="section-card">
                    <div className="control-label">
                        <Layers size={14} /> Global Style
                    </div>

                    <div className="control-group">
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Font Family</span>
                        <select
                            name="fontFamily"
                            value={config.fontFamily}
                            onChange={handleChange}
                            className="control-input"
                        >
                            <option value="'Inter', sans-serif">Inter (Modern)</option>
                            <option value="'Georgia', serif">Georgia (Classic)</option>
                            <option value="'Courier New', monospace">Courier (Code)</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Background Presets</span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {[
                                { name: 'Midnight', c1: '#0f172a', c2: '#1e1b4b' },
                                { name: 'Ocean', c1: '#0c4a6e', c2: '#164e63' },
                                { name: 'Sunset', c1: '#7c2d12', c2: '#4c1d95' },
                                { name: 'Aurora', c1: '#042f2e', c2: '#1e3a5f' },
                                { name: 'Ember', c1: '#451a03', c2: '#7f1d1d' },
                                { name: 'Lavender', c1: '#3b0764', c2: '#1e1b4b' },
                                { name: 'Forest', c1: '#052e16', c2: '#1a2e05' },
                                { name: 'Coral', c1: '#6b2146', c2: '#2d1b69' },
                                { name: 'Slate', c1: '#1e293b', c2: '#0f172a' },
                                { name: 'Neon', c1: '#0a0a0a', c2: '#14532d' },
                                { name: 'Berry', c1: '#500724', c2: '#3b0764' },
                                { name: 'Gold', c1: '#422006', c2: '#1c1917' },
                            ].map((preset) => (
                                <button
                                    key={preset.name}
                                    title={preset.name}
                                    onClick={() => setConfig((prev) => ({ ...prev, backgroundColor: preset.c1, backgroundColor2: preset.c2 }))}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        border: config.backgroundColor === preset.c1 && config.backgroundColor2 === preset.c2
                                            ? '2px solid var(--accent-primary)'
                                            : '2px solid rgba(255,255,255,0.1)',
                                        background: `linear-gradient(145deg, ${preset.c1}, ${preset.c2})`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0,
                                        padding: 0,
                                        boxShadow: config.backgroundColor === preset.c1 && config.backgroundColor2 === preset.c2
                                            ? '0 0 8px rgba(59,130,246,0.4)'
                                            : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Background Pattern</span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {[
                                { key: 'none', label: 'None', css: {} },
                                { key: 'dots', label: 'Dots', css: { backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '6px 6px' } },
                                { key: 'grid', label: 'Grid', css: { backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '7px 7px' } },
                                { key: 'diagonal-stripes', label: 'Stripes', css: { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 4px)' } },
                                { key: 'honeycomb', label: 'Honey', css: { backgroundImage: 'radial-gradient(circle farthest-side at 0% 50%, transparent 23%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.15) 27%, transparent 29%), radial-gradient(circle farthest-side at 0% 50%, transparent 23%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.15) 27%, transparent 29%)', backgroundSize: '10px 17px', backgroundPosition: '0 0, 5px 8.5px' } },
                                { key: 'chevron', label: 'Chevron', css: { backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.15) 25%, transparent 25%)', backgroundSize: '7px 7px', backgroundPosition: '0 0, 3.5px 0' } },
                                { key: 'circles', label: 'Rings', css: { backgroundImage: 'radial-gradient(circle, transparent 40%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.12) 48%, transparent 50%)', backgroundSize: '12px 12px' } },
                                { key: 'crosshatch', label: 'Cross', css: { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px), repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)' } },
                                { key: 'diamonds', label: 'Diamond', css: { backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%)', backgroundSize: '9px 9px' } },
                            ].map((p) => (
                                <button
                                    key={p.key}
                                    title={p.label}
                                    onClick={() => setConfig((prev) => ({ ...prev, backgroundPattern: p.key }))}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '6px',
                                        border: config.backgroundPattern === p.key
                                            ? '2px solid var(--accent-primary)'
                                            : '2px solid rgba(255,255,255,0.1)',
                                        background: '#1a1a2e',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0,
                                        padding: 0,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: config.backgroundPattern === p.key
                                            ? '0 0 8px rgba(59,130,246,0.4)'
                                            : 'none',
                                        ...p.css,
                                        fontSize: p.key === 'none' ? '9px' : '0',
                                        color: 'var(--text-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 600,
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {p.key === 'none' ? '✕' : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Custom Colors</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="color"
                                name="backgroundColor"
                                value={config.backgroundColor || '#111111'}
                                onChange={handleChange}
                                className="color-picker"
                                style={{ flex: 1 }}
                                title="Background Color 1"
                            />
                            <input
                                type="color"
                                name="backgroundColor2"
                                value={config.backgroundColor2 || '#2a2a2a'}
                                onChange={handleChange}
                                className="color-picker"
                                style={{ flex: 1 }}
                                title="Background Color 2 (Gradient)"
                            />
                        </div>
                    </div>
                </div>

                {/* Layout & Device */}
                <div className="section-card">
                    <div className="control-label">
                        <LayoutTemplate size={14} /> Layout & Device
                    </div>

                    <div className="control-group">
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Mockup Positioning</span>
                        <select
                            name="layout"
                            value={config.layout}
                            onChange={handleChange}
                            className="control-input"
                        >
                            <option value="text-top">Device Bottom</option>
                            <option value="text-bottom">Device Top</option>
                            <option value="center">Device Center (No Edge)</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Device Frame</span>
                        <select
                            name="deviceType"
                            value={config.deviceType}
                            onChange={handleChange}
                            className="control-input"
                        >
                            <option value="iphone-65">iPhone (6.5" / 6.7")</option>
                            <option value="iphone-55">iPhone (5.5" Classic)</option>
                            <option value="ipad-pro">iPad Pro (12.9")</option>
                            <option value="galaxy-a17">Samsung Galaxy A17 5G</option>
                        </select>
                    </div>
                </div>

                {/* Media Asset */}
                <div className="section-card">
                    <div className="control-label">
                        <ImageIcon size={14} /> Screen Asset
                    </div>
                    <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        border: '1px dashed var(--border-focus)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease'
                    }}
                        className="upload-box"
                    >
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {config.appImage ? 'Replace Image' : 'Click to Upload'}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
            </div>
        </aside>
    );
}
