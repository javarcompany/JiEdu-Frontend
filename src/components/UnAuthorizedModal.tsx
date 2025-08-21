<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                    <div className="relative flex flex-col items-center justify-center p-15 overflow-hidden z-1">
                        <GridShape />
                        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
                            <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
                                ERROR
                            </h1>
                
                            <img src="/images/error/404.svg" alt="404" className="dark:hidden" />
                            <img
                                src="/images/error/404-dark.svg"
                                alt="404"
                                className="hidden dark:block"
                            />
                
                            <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
                                We can’t seem to find the page you are looking for!
                            </p>
                                        
                            <button
                                onClick={closeModal}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Close
                            </button>
                        </div>
                        {/* <!-- Footer --> */}
                        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} - JiEdu Systems
                        </p>
                    </div>
                </Modal>