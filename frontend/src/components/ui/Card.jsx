import './Card.css';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  header,
  footer,
  ...props
}) => {
  return (
    <div className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`} {...props}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
