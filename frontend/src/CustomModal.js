import React from 'react';

export function CustomModal({ isOpen, onClose, title, message, type = 'info', onConfirm = null, showCancel = false }) {
    if (!isOpen) return null;

    const getModalStyle = () => {
        const baseStyle = {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // More subtle backdrop
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(2px)' // Reduced blur
        };
        return baseStyle;
    };

    const getContentStyle = () => {
        let backgroundColor, borderColor, iconColor;
        
        switch (type) {
            case 'error':
                backgroundColor = '#ffffff';
                borderColor = '#ef4444';
                iconColor = '#dc2626';
                break;
            case 'warning':
                backgroundColor = '#ffffff';
                borderColor = '#f59e0b';
                iconColor = '#d97706';
                break;
            case 'success':
                backgroundColor = '#ffffff';
                borderColor = '#10b981';
                iconColor = '#059669';
                break;
            case 'confirm':
                backgroundColor = '#ffffff';
                borderColor = '#3b82f6';
                iconColor = '#2563eb';
                break;
            default:
                backgroundColor = '#ffffff';
                borderColor = '#6b7280';
                iconColor = '#4b5563';
        }

        return {
            backgroundColor,
            borderColor,
            iconColor,
            content: {
                background: backgroundColor,
                border: `1px solid #e5e7eb`,
                borderTop: `3px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '1.25rem',
                maxWidth: '320px',
                width: '80%',
                maxHeight: '60vh',
                overflowY: 'auto',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                textAlign: 'center',
                position: 'relative',
                transform: 'scale(1)',
                transition: 'all 0.2s ease'
            }
        };
    };

    const getIcon = () => {
        switch (type) {
            case 'error': return '⚠';
            case 'warning': return '⚠';
            case 'success': return '✓';
            case 'confirm': return '?';
            case 'info': return 'i';
            default: return 'i';
        }
    };

    const styles = getContentStyle();

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <>
            <div style={getModalStyle()} onClick={handleOverlayClick}>
                <div style={styles.content}>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '12px',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            transition: 'color 0.2s ease',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#4b5563'}
                        onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                    >
                        ×
                    </button>

                    {/* Icon */}
                    <div style={{ 
                        fontSize: '2rem',
                        marginBottom: '0.75rem',
                        color: styles.iconColor,
                        fontWeight: '600'
                    }}>
                        {getIcon()}
                    </div>

                    {/* Title */}
                    <h2 style={{ 
                        margin: '0 0 0.75rem 0',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        lineHeight: '1.3'
                    }}>
                        {title}
                    </h2>

                    {/* Message */}
                    <div style={{ 
                        fontSize: '0.875rem',
                        lineHeight: '1.4',
                        color: '#6b7280',
                        marginBottom: '1.25rem',
                        whiteSpace: 'pre-line'
                    }}>
                        {message}
                    </div>

                    {/* Buttons */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '0.6rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        {showCancel && (
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    background: '#ffffff',
                                    color: '#6b7280',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    minWidth: '70px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#f9fafb';
                                    e.target.style.borderColor = '#9ca3af';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = '#ffffff';
                                    e.target.style.borderColor = '#d1d5db';
                                }}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={onConfirm ? handleConfirm : onClose}
                            style={{
                                padding: '8px 16px',
                                border: `1px solid ${styles.borderColor}`,
                                borderRadius: '8px',
                                background: styles.iconColor,
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                minWidth: '70px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            {onConfirm ? 'Confirm' : 'OK'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
