<div className="flex items-center justify-between">
  <button
    className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 cursor-not-allowed opacity-50"
    disabled=""
  >
    <MoveLeft className="h-4 w-4" />
    <span className="hidden sm:inline">Previous</span>
  </button>

  <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 sm:hidden">Page 1 of 3</span>

  <ul className="hidden items-center gap-0.5 sm:flex">
    <li>
      <button className="flex h-10 w-10 items-center justify-center rounded-lg text-theme-sm font-medium bg-brand-500 text-white">
        1
      </button>
    </li>
    <li>
      <button className="flex h-10 w-10 items-center justify-center rounded-lg text-theme-sm font-medium text-gray-700 hover:bg-brand-500/[0.08] dark:hover:bg-brand-500 dark:hover:text-white hover:text-brand-500 dark:text-gray-400 ">
        2
      </button>
    </li>
    <li>
      <button className="flex h-10 w-10 items-center justify-center rounded-lg text-theme-sm font-medium text-gray-700 hover:bg-brand-500/[0.08] dark:hover:bg-brand-500 dark:hover:text-white hover:text-brand-500 dark:text-gray-400 ">
        3
      </button>
    </li>
  </ul>

  <button
    className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 "
  >
    <span className="hidden sm:inline">Next</span>
    <MoveRight className="h-4 w-4" />
  </button>
</div>