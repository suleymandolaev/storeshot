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
            text: type === 'badge' ? 'New Badge' : 'New Text',
            color: type === 'badge' ? '#000000' : '#ffffff',
            backgroundColor: type === 'badge' ? '#ffffff' : 'rgba(0,0,0,0)',
            fontSize: type === 'badge' ? 20 : 40,
            fontWeight: type === 'badge' ? 600 : 700,
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
                        <div style={{ display: 'flex', gap: '4px' }}>
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

                                <textarea
                                    value={el.text}
                                    onChange={(e) => updateElement(el.id, 'text', e.target.value)}
                                    className="control-input"
                                    style={{ marginBottom: '8px', fontSize: '12px' }}
                                    rows={2}
                                />

                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={el.color}
                                        onChange={(e) => updateElement(el.id, 'color', e.target.value)}
                                        className="color-picker"
                                        title="Text Color"
                                    />
                                    {el.type === 'badge' && (
                                        <input
                                            type="color"
                                            value={el.backgroundColor !== 'rgba(0,0,0,0)' ? el.backgroundColor : '#ffffff'}
                                            onChange={(e) => updateElement(el.id, 'backgroundColor', e.target.value)}
                                            className="color-picker"
                                            title="Badge Background"
                                        />
                                    )}
                                    <input
                                        type="number"
                                        value={el.fontSize}
                                        onChange={(e) => updateElement(el.id, 'fontSize', parseInt(e.target.value))}
                                        className="control-input"
                                        style={{ padding: '4px 8px', flex: '1' }}
                                        title="Font Size"
                                    />
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
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Background Colors</span>
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
