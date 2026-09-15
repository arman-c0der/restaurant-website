export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="h-5 w-28 bg-gray-200 rounded-full animate-pulse mb-6" />

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Image skeleton */}
            <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl bg-gray-200 animate-pulse" />

            {/* Details skeleton */}
            <div className="flex flex-col gap-4 pt-1">
              <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse mt-2" />
              <div className="h-20 w-full bg-gray-200 rounded-2xl animate-pulse mt-2" />
              <div className="flex gap-3 mt-6">
                <div className="h-12 flex-1 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-12 flex-1 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}