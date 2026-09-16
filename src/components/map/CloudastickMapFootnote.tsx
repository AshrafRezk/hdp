const LOGO_SRC = '/cloudastick-map-logo.jpg'

export default function CloudastickMapFootnote() {
  return (
    <div className="cloudastick-map-footnote" aria-label="Cloudastick Map Intelligence">
      <img className="cloudastick-map-logo" src={LOGO_SRC} alt="" />
      <span className="cloudastick-map-label">Cloudastick Map Intelligence</span>
    </div>
  )
}
