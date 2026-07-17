export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full max-w-sm mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Drafting sheet frame */}
      <rect x="20" y="20" width="360" height="360" rx="4" stroke="#274B7A" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Open book, drawn as isometric linework */}
      <path
        d="M70 230 L200 180 L330 230 L200 280 Z"
        stroke="#F5F3EE"
        strokeWidth="2"
        fill="none"
      />
      <path d="M200 180 L200 280" stroke="#E8871E" strokeWidth="2" />
      <path d="M90 222 L190 188 M90 236 L190 202 M90 250 L190 216" stroke="#F5F3EE" strokeWidth="1" opacity="0.5" />
      <path d="M210 188 L310 222 M210 202 L310 236 M210 216 L310 250" stroke="#F5F3EE" strokeWidth="1" opacity="0.5" />

      {/* Graduation cap, floating above the book */}
      <path
        d="M200 90 L270 120 L200 150 L130 120 Z"
        stroke="#E8871E"
        strokeWidth="2"
        fill="#0B2545"
      />
      <path d="M200 150 L200 175" stroke="#E8871E" strokeWidth="2" />
      <circle cx="200" cy="178" r="3" fill="#E8871E" />
      <path d="M245 128 L245 155" stroke="#F5F3EE" strokeWidth="1.5" />
      <path d="M245 155 Q 245 165 235 165" stroke="#F5F3EE" strokeWidth="1.5" fill="none" />

      {/* Pencil, drafting-tool style */}
      <path d="M280 300 L320 260" stroke="#F5F3EE" strokeWidth="4" strokeLinecap="round" />
      <path d="M320 260 L332 248 L340 256 L328 268 Z" stroke="#E8871E" strokeWidth="2" fill="#0B2545" />
      <path d="M280 300 L272 308 L280 316 L288 308 Z" fill="#274B7A" stroke="#F5F3EE" strokeWidth="1" />

      {/* Corner crop marks matching card style */}
      <path d="M20 20 L20 40 M20 20 L40 20" stroke="#E8871E" strokeWidth="2" />
      <path d="M380 380 L380 360 M380 380 L360 380" stroke="#E8871E" strokeWidth="2" />

      {/* Small grid-paper accents */}
      <circle cx="60" cy="340" r="2" fill="#274B7A" />
      <circle cx="340" cy="60" r="2" fill="#274B7A" />
    </svg>
  );
}
