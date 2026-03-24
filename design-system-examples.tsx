/**
 * SJ Electronics - Design System Examples
 * Ejemplos de implementación práctica de componentes
 * 
 * Este archivo contiene ejemplos de código para implementar
 * los componentes definidos en design-system.json
 */

import React from 'react';

// ============================================================================
// TOKENS - CSS Variables Implementation
// ============================================================================

/**
 * Generar CSS Variables desde tokens
 * Usar en archivo global CSS o styled-components theme
 */
export const cssVariables = `
:root {
  /* Colors - Brand Primary */
  --sj-color-brand-primary-50: #FFF1F1;
  --sj-color-brand-primary-100: #FFE0E0;
  --sj-color-brand-primary-600: #C9141F;
  --sj-color-brand-primary-700: #A80F18;
  --sj-color-brand-primary-900: #5C050A;

  /* Colors - Brand Secondary */
  --sj-color-brand-secondary-500: #2563EB;
  --sj-color-brand-secondary-600: #1D4ED8;
  --sj-color-brand-secondary-700: #1E40AF;

  /* Colors - Neutral */
  --sj-color-neutral-0: #FFFFFF;
  --sj-color-neutral-50: #F8FAFC;
  --sj-color-neutral-100: #F1F5F9;
  --sj-color-neutral-200: #E2E8F0;
  --sj-color-neutral-500: #64748B;
  --sj-color-neutral-900: #0B1220;

  /* Spacing */
  --sj-spacing-1: 4px;
  --sj-spacing-2: 8px;
  --sj-spacing-3: 12px;
  --sj-spacing-4: 16px;
  --sj-spacing-6: 24px;
  --sj-spacing-8: 32px;

  /* Radius */
  --sj-radius-sm: 6px;
  --sj-radius-md: 10px;
  --sj-radius-lg: 14px;
  --sj-radius-pill: 999px;

  /* Shadow */
  --sj-shadow-sm: 0 1px 3px rgba(11, 18, 32, 0.08);
  --sj-shadow-md: 0 4px 6px rgba(11, 18, 32, 0.08);
  --sj-shadow-lg: 0 10px 15px rgba(11, 18, 32, 0.08);

  /* Typography */
  --sj-font-display: 'Montserrat', sans-serif;
  --sj-font-body: 'Inter', sans-serif;
  --sj-font-weight-regular: 400;
  --sj-font-weight-medium: 500;
  --sj-font-weight-semibold: 600;
  --sj-font-weight-bold: 700;

  /* Motion */
  --sj-duration-fast: 120ms;
  --sj-duration-normal: 200ms;
  --sj-duration-slow: 400ms;
  --sj-easing-standard: cubic-bezier(0.2, 0, 0, 1);
}
`;

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  children,
  type = 'button',
}) => {
  const baseStyles = {
    fontFamily: 'var(--sj-font-body)',
    fontWeight: 'var(--sj-font-weight-semibold)',
    borderRadius: 'var(--sj-radius-pill)',
    transition: 'all var(--sj-duration-fast) var(--sj-easing-standard)',
    border: '1px solid transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.7 : 1,
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: icon ? '8px' : '0',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--sj-color-brand-primary-600)',
      color: 'var(--sj-color-neutral-0)',
      ':hover': { backgroundColor: 'var(--sj-color-brand-primary-700)' },
    },
    secondary: {
      backgroundColor: 'var(--sj-color-neutral-900)',
      color: 'var(--sj-color-neutral-0)',
      ':hover': { backgroundColor: 'var(--sj-color-neutral-800)' },
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--sj-color-neutral-900)',
      borderColor: 'var(--sj-color-neutral-300)',
      ':hover': { backgroundColor: 'var(--sj-color-neutral-50)' },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--sj-color-neutral-900)',
      ':hover': { backgroundColor: 'var(--sj-color-neutral-50)' },
    },
    destructive: {
      backgroundColor: '#991B1B',
      color: 'var(--sj-color-neutral-0)',
      ':hover': { backgroundColor: '#7F1D1D' },
    },
    link: {
      backgroundColor: 'transparent',
      color: 'var(--sj-color-brand-secondary-600)',
      textDecoration: 'underline',
      ':hover': { color: 'var(--sj-color-brand-secondary-700)' },
    },
  };

  const sizeStyles = {
    xs: { height: '32px', padding: '0 12px', fontSize: '14px' },
    sm: { height: '36px', padding: '0 14px', fontSize: '14px' },
    md: { height: '44px', padding: '0 16px', fontSize: '16px' },
    lg: { height: '48px', padding: '0 20px', fontSize: '18px' },
    xl: { height: '56px', padding: '0 24px', fontSize: '18px' },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {loading && <Spinner size="sm" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

// Ejemplos de uso
export const ButtonExamples = () => (
  <>
    {/* CTA Principal */}
    <Button variant="primary" size="lg" icon={<ShoppingCartIcon />}>
      Agregar al carrito
    </Button>

    {/* Botón secundario */}
    <Button variant="outline" size="md">
      Ver detalle
    </Button>

    {/* Botón destructivo */}
    <Button variant="destructive" size="sm" icon={<TrashIcon />}>
      Eliminar
    </Button>

    {/* Botón con loading */}
    <Button variant="primary" loading>
      Procesando...
    </Button>

    {/* Botón full width */}
    <Button variant="primary" size="lg" fullWidth>
      Finalizar compra
    </Button>
  </>
);

// ============================================================================
// INPUT COMPONENT
// ============================================================================

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  value?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  size = 'md',
  label,
  placeholder,
  helperText,
  error,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  clearable = false,
  value,
  onChange,
  onFocus,
  onBlur,
}) => {
  const sizeStyles = {
    sm: { height: '36px', padding: '0 10px', fontSize: '14px' },
    md: { height: '44px', padding: '0 12px', fontSize: '16px' },
    lg: { height: '52px', padding: '0 14px', fontSize: '18px' },
  };

  const inputStyles = {
    ...sizeStyles[size],
    width: '100%',
    fontFamily: 'var(--sj-font-body)',
    backgroundColor: disabled ? 'var(--sj-color-neutral-100)' : 'var(--sj-color-neutral-0)',
    color: 'var(--sj-color-neutral-900)',
    border: `1px solid ${error ? '#EF4444' : 'var(--sj-color-neutral-200)'}`,
    borderRadius: 'var(--sj-radius-md)',
    transition: 'border-color var(--sj-duration-fast)',
    paddingLeft: icon && iconPosition === 'left' ? '40px' : sizeStyles[size].padding,
    paddingRight: icon && iconPosition === 'right' ? '40px' : sizeStyles[size].padding,
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 'var(--sj-font-weight-medium)',
          marginBottom: '8px',
          color: 'var(--sj-color-neutral-900)',
        }}>
          {label}
          {required && <span style={{ color: 'var(--sj-color-brand-primary-600)' }}> *</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            [iconPosition]: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--sj-color-neutral-500)',
          }}>
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          value={value}
          onChange={(e) => onChange?.(e.target.value, e)}
          onFocus={onFocus}
          onBlur={onBlur}
          style={inputStyles}
        />
        
        {clearable && value && (
          <button
            onClick={() => onChange?.('', {} as any)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--sj-color-neutral-500)',
            }}
          >
            <XIcon />
          </button>
        )}
      </div>

      {(helperText || error) && (
        <p style={{
          fontSize: '12px',
          marginTop: '4px',
          color: error ? '#EF4444' : 'var(--sj-color-neutral-500)',
        }}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// Ejemplos de uso
export const InputExamples = () => (
  <>
    {/* Input básico */}
    <Input
      label="Email"
      type="email"
      placeholder="tu@email.com"
      required
    />

    {/* Input con icono */}
    <Input
      label="Buscar"
      type="search"
      icon={<SearchIcon />}
      placeholder="Buscar productos..."
      clearable
    />

    {/* Input con error */}
    <Input
      label="Teléfono"
      type="tel"
      error="El formato del teléfono no es válido"
    />

    {/* Input con helper text */}
    <Input
      label="Código postal"
      helperText="Ingresa tu código postal de 5 dígitos"
    />
  </>
);

// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}) => {
  const cardStyles = {
    backgroundColor: 'var(--sj-color-neutral-0)',
    border: '1px solid var(--sj-color-neutral-200)',
    borderRadius: 'var(--sj-radius-lg)',
    overflow: 'hidden',
    transition: 'all var(--sj-duration-fast)',
    cursor: 'pointer',
  };

  const imageContainerStyles = {
    position: 'relative' as const,
    aspectRatio: '1/1',
    backgroundColor: 'var(--sj-color-neutral-50)',
    overflow: 'hidden',
  };

  const contentStyles = {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div
      style={cardStyles}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--sj-shadow-md)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image Container */}
      <div style={imageContainerStyles}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {/* Badges */}
        {product.badge && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
          }}>
            <Badge variant="promo" size="xs">
              {product.badge}
            </Badge>
          </div>
        )}

        {product.discount && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
          }}>
            <Badge variant="promo" size="xs">
              -{product.discount}%
            </Badge>
          </div>
        )}

        {/* Actions (visible on hover) */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          opacity: 0,
          transition: 'opacity var(--sj-duration-fast)',
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist?.(product.id);
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--sj-radius-circle)',
              backgroundColor: 'var(--sj-color-neutral-0)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HeartIcon />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product.id);
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--sj-radius-circle)',
              backgroundColor: 'var(--sj-color-neutral-0)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EyeIcon />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'var(--sj-font-weight-semibold)',
            color: 'var(--sj-color-neutral-500)',
          }}>
            Agotado
          </div>
        )}
      </div>

      {/* Content */}
      <div style={contentStyles}>
        {/* Title */}
        <h3 style={{
          fontSize: '14px',
          fontWeight: 'var(--sj-font-weight-semibold)',
          color: 'var(--sj-color-neutral-900)',
          lineHeight: '1.4',
          minHeight: '40px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--sj-color-neutral-500)',
          }}>
            <StarIcon />
            <span>{product.rating.toFixed(1)}</span>
            {product.reviewCount && (
              <span>({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 'var(--sj-font-weight-bold)',
            color: 'var(--sj-color-brand-primary-600)',
          }}>
            {formatPrice(product.price)}
          </span>
          
          {product.originalPrice && (
            <span style={{
              fontSize: '14px',
              color: 'var(--sj-color-neutral-500)',
              textDecoration: 'line-through',
            }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {product.inStock && (
          <Button
            variant="primary"
            size="md"
            fullWidth
            icon={<ShoppingCartIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product.id);
            }}
          >
            Agregar al carrito
          </Button>
        )}
      </div>
    </div>
  );
};

// Ejemplo de uso
export const ProductCardExample = () => {
  const sampleProduct: Product = {
    id: '123',
    name: 'Bocina Bluetooth Portátil con Luces RGB',
    image: '/products/bocina.jpg',
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    badge: 'OFERTA',
  };

  return (
    <div style={{ maxWidth: '280px' }}>
      <ProductCard
        product={sampleProduct}
        onAddToCart={(id) => console.log('Add to cart:', id)}
        onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
        onQuickView={(id) => console.log('Quick view:', id)}
      />
    </div>
  );
};

// ============================================================================
// MODAL COMPONENT
// ============================================================================

interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  title,
  footer,
  children,
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const sizeStyles = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '800px' },
    xl: { maxWidth: '1000px' },
    full: { maxWidth: 'calc(100vw - 32px)', maxHeight: 'calc(100vh - 32px)' },
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Overlay */}
      <div
        onClick={closeOnOverlayClick ? onClose : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(11, 18, 32, 0.65)',
          animation: 'fadeIn 200ms ease-out',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--sj-color-neutral-0)',
          borderRadius: 'var(--sj-radius-xl)',
          boxShadow: 'var(--sj-shadow-2xl)',
          padding: '24px',
          maxHeight: 'calc(100vh - 64px)',
          overflow: 'auto',
          animation: 'slideUp 300ms ease-out',
          ...sizeStyles[size],
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            {title && (
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'var(--sj-font-weight-bold)',
                color: 'var(--sj-color-neutral-900)',
              }}>
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--sj-radius-circle)',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <XIcon />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <div style={{
            marginTop: '20px',
            borderTop: '1px solid var(--sj-color-neutral-100)',
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Ejemplo de uso
export const ModalExample = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Modal
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmar acción"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirmar
            </Button>
          </>
        }
      >
        <p>¿Estás seguro de que deseas realizar esta acción?</p>
      </Modal>
    </>
  );
};

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

// Spinner
const Spinner: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { xs: 16, sm: 20, md: 24, lg: 32 };
  return (
    <div
      style={{
        width: sizes[size],
        height: sizes[size],
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 800ms linear infinite',
      }}
    />
  );
};

// Badge
const Badge: React.FC<{
  variant?: 'default' | 'promo' | 'new';
  size?: 'xs' | 'sm' | 'md';
  children: React.ReactNode;
}> = ({ variant = 'default', size = 'sm', children }) => {
  const variantStyles = {
    default: {
      backgroundColor: 'var(--sj-color-neutral-100)',
      color: 'var(--sj-color-neutral-700)',
    },
    promo: {
      backgroundColor: 'var(--sj-color-brand-primary-600)',
      color: 'var(--sj-color-neutral-0)',
    },
    new: {
      backgroundColor: 'var(--sj-color-brand-secondary-600)',
      color: 'var(--sj-color-neutral-0)',
    },
  };

  const sizeStyles = {
    xs: { padding: '2px 6px', fontSize: '10px' },
    sm: { padding: '3px 8px', fontSize: '12px' },
    md: { padding: '4px 10px', fontSize: '14px' },
  };

  return (
    <span
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: 'var(--sj-radius-pill)',
        fontWeight: 'var(--sj-font-weight-semibold)',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
};

// Icon placeholders (sustituir con librería real como lucide-react)
const ShoppingCartIcon = () => <span>🛒</span>;
const HeartIcon = () => <span>❤️</span>;
const EyeIcon = () => <span>👁</span>;
const StarIcon = () => <span>⭐</span>;
const TrashIcon = () => <span>🗑️</span>;
const SearchIcon = () => <span>🔍</span>;
const XIcon = () => <span>✕</span>;

// ============================================================================
// CSS ANIMATIONS (agregar a archivo CSS global)
// ============================================================================

export const cssAnimations = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Reducir animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

// ============================================================================
// THEME CONFIGURATION (para styled-components / emotion)
// ============================================================================

export const theme = {
  colors: {
    brand: {
      primary: {
        50: '#FFF1F1',
        100: '#FFE0E0',
        600: '#C9141F',
        700: '#A80F18',
      },
      secondary: {
        500: '#2563EB',
        600: '#1D4ED8',
        700: '#1E40AF',
      },
    },
    neutral: {
      0: '#FFFFFF',
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      500: '#64748B',
      900: '#0B1220',
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    pill: '999px',
  },
  shadow: {
    sm: '0 1px 3px rgba(11, 18, 32, 0.08)',
    md: '0 4px 6px rgba(11, 18, 32, 0.08)',
    lg: '0 10px 15px rgba(11, 18, 32, 0.08)',
  },
  breakpoints: {
    xs: '360px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
  },
};

export type Theme = typeof theme;
