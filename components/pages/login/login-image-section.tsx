export default function LoginImageSection() {
  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center p-12 rounded-3xl relative overflow-hidden"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/login-SQsOntrP7S0EJGLCao7jwvF7crAgty.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-blue-600/60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        {/* Snowflake Icon */}
        <div className="mb-6 text-5xl">❄️</div>

        {/* Main Text */}
        <h2 className="text-4xl font-bold mb-4 leading-tight">يتركك تقدر تخفف معاناة</h2>

        {/* Subtitle */}
        <h3 className="text-5xl font-bold mb-6">أهل غزة</h3>

        {/* Heart Icon */}
        <div className="text-4xl">❤️</div>
      </div>
    </div>
  )
}
