const NavbarSkeleton = () => {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="h-[40px] md:h-[70px] w-[200px] md:w-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
        </div>
      </nav>
    </header>
  );
};

export default NavbarSkeleton;
