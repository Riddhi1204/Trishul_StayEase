import { Link } from 'react-router-dom'
import './Card.css'

export default function Card({
  id,
  image,
  tag,
  title,
  location,
  description,
  price,
  rating,
  reviews,
  features = [],
  isWishlisted = false,
  onWishlistClick,
  onBookClick,
}) {
  return (
    <article className="card" role="article">
      {/* Image */}
      <div className="card__img-wrap">
        <div className="card__img" style={{ backgroundImage: `url(${image})` }} />
        <div className="card__tag">{tag}</div>
        <button 
          className="card__wishlist" 
          aria-label="Add to wishlist"
          onClick={() => onWishlistClick && onWishlistClick(id)}
          style={{ color: isWishlisted ? 'red' : 'inherit' }}
        >
          {isWishlisted ? '❤️' : '♡'}
        </button>
      </div>

      {/* Body */}
      <div className="card__body">
        <div className="card__meta">
          <span className="card__location">📍 {location}</span>
          <span className="card__rating">
            ⭐ {rating}
            <span className="card__reviews">({reviews})</span>
          </span>
        </div>

        <h3 className="card__title">{title}</h3>
        <p className="card__desc">{description}</p>

        {/* Features */}
        {features.length > 0 && (
          <ul className="card__features" aria-label="Features">
            {features.map(f => (
              <li key={f} className="card__feature">{f}</li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="card__footer">
          <div className="card__price">
            <span className="card__price-value">₹{price}</span>
            <span className="card__price-unit"> / night</span>
          </div>
          <button onClick={() => onBookClick && onBookClick(id)} className="btn btn-primary card__btn">
            Book Now
          </button>
        </div>
      </div>
    </article>
  )
}
