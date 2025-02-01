import React from 'react'

function Welcome() {
    return (
        <div>
            <nav class="fixed inset-x-0 top-0 z-50 flex items-center justify-center h-20 py-3 [&.is-sticky]:bg-white dark:[&.is-sticky]:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 [&.is-sticky]:shadow-lg [&.is-sticky]:shadow-slate-200/25 dark:[&.is-sticky]:shadow-zinc-700/30 navbar" id="navbar">
                <div class="container 2xl:max-w-[87.5rem] px-4 mx-auto flex items-center self-center w-full">
                    <div class="shrink-0">
                        <a href="#!">
                            <img src="assets/images/logo-dark.png" alt="" class="block h-6 dark:hidden"/>
                                <img src="assets/images/logo-light.png" alt="" class="hidden h-6 dark:block"/>
                                </a>
                            </div>
                            <div class="mx-auto">
                                <ul id="navbar7" class="absolute inset-x-0 z-20 items-center hidden py-3 mt-px bg-white shadow-lg md:mt-0 dark:bg-zinc-800 dark:md:bg-transparent md:z-0 navbar-menu rounded-b-md md:shadow-none md:flex top-full ltr:ml-auto rtl:mr-auto md:relative md:bg-transparent md:rounded-none md:top-auto md:py-0">
                                    <li>
                                        <a href="#home" class="block md:inline-block px-4 md:px-3 py-2.5 md:py-0.5 text-15 font-medium text-slate-800 transition-all duration-300 ease-linear hover:text-custom-500 [&.active]:text-custom-500 dark:text-zinc-200 dark:hover:text-custom-500 dark:[&.active]:text-custom-500 active">Home</a>
                                    </li>
                                    <li>
                                        <a href="#product" class="block md:inline-block px-4 md:px-3 py-2.5 md:py-0.5 text-15 font-medium text-slate-800 transition-all duration-300 ease-linear hover:text-custom-500 [&.active]:text-custom-500 dark:text-zinc-200 dark:hover:text-custom-500 dark:[&.active]:text-custom-500">Our Product</a>
                                    </li>
                                    <li>
                                        <a href="#features" class="block md:inline-block px-4 md:px-3 py-2.5 md:py-0.5 text-15 font-medium text-slate-800 transition-all duration-300 ease-linear hover:text-custom-500 [&.active]:text-custom-500 dark:text-zinc-200 dark:hover:text-custom-500 dark:[&.active]:text-custom-500">Features</a>
                                    </li>
                                    <li>
                                        <a href="#about" class="block md:inline-block px-4 md:px-3 py-2.5 md:py-0.5 text-15 font-medium text-slate-800 transition-all duration-300 ease-linear hover:text-custom-500 [&.active]:text-custom-500 dark:text-zinc-200 dark:hover:text-custom-500 dark:[&.active]:text-custom-500">About Us</a>
                                    </li>
                                    <li>
                                        <a href="#feedback" class="block md:inline-block px-4 md:px-3 py-2.5 md:py-0.5 text-15 font-medium text-slate-800 transition-all duration-300 ease-linear hover:text-custom-500 [&.active]:text-custom-500 dark:text-zinc-200 dark:hover:text-custom-500 dark:[&.active]:text-custom-500">Feedback</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="flex gap-2">
                                <div class="ltr:ml-auto rtl:mr-auto md:hidden navbar-toggale-button">
                                    <button type="button" class="flex items-center  justify-center size-[37.5px] p-0 text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"><i data-lucide="menu"></i></button>
                                </div>
                                <button type="button" class="text-slate-500 dark:text-zinc-300 hover:text-custom-500 dark:hover:text-custom-500 border-0 btn bg-gradient-to-r w-[36.39px] p-0 flex items-center justify-center"><i data-lucide="shopping-bag" class="inline-block size-4"></i></button>
                                <button type="button" class="text-white border-0 btn bg-gradient-to-r from-custom-500 to-purple-500 hover:text-white hover:from-purple-500 hover:to-custom-500"><span class="align-middle">Sign In</span> <i data-lucide="log-in" class="inline-block size-4 ltr:ml-1 rtl:mr-1"></i></button>
                            </div>
                    </div>
            </nav>

            <section class="relative pb-28 xl:pb-36 pt-44 xl:pt-52" id="home">
                <div class="absolute top-0 left-0 size-64 bg-custom-500 opacity-10 blur-3xl"></div>
                <div class="absolute bottom-0 right-0 size-64 bg-purple-500/10 blur-3xl"></div>
                <div class="container 2xl:max-w-[87.5rem] px-4 mx-auto">
                    <div class="grid items-center grid-cols-12 gap-5 2xl:grid-cols-12">
                        <div class="col-span-12 xl:col-span-5 2xl:col-span-5">
                            <h1 class="mb-4 !leading-normal lg:text-5xl 2xl:text-6xl dark:text-zinc-100" data-aos="fade-right" data-aos-delay="300">Exclusive Collections 2024</h1>
                            <p class="text-lg mb-7 text-slate-500 dark:text-zinc-400" data-aos="fade-right" data-aos-delay="600">In 2024, metallics will be taking over the sneaker world. I love this trend because there are so many different ways to wear it. You can wear sequined sneakers, white sneakers with metallic accents, or all-over silver.</p>
                            <div class="flex items-center gap-2" data-aos="fade-right" data-aos-delay="800">
                                <button type="button" class="px-8 py-3 text-white border-0 text-15 btn bg-gradient-to-r from-custom-500 to-purple-500 hover:text-white hover:from-purple-500 hover:to-custom-500">Shop Now <i data-lucide="shopping-cart" class="inline-block align-middle size-4 rtl:mr-1 ltr:ml-1"></i></button>
                            </div>
                        </div>
                        <div class="col-span-12 xl:col-span-7 2xl:col-start-8 2xl:col-span-6">
                            <div class="relative mt-10 xl:mt-0">
                                <div class="absolute text-center -top-20 xl:-right-40 lg:text-[10rem] 2xl:text-[14rem] text-slate-100 dark:text-zinc-800/60 font-tourney" data-aos="zoom-in-down" data-aos-delay="1400">
                                    Unique Fashion
                                </div>
                                <img src="assets/images/offer.png" alt="" class="absolute h-40 left-10 xl:-left-10 top-32" data-aos="fade-down-right" data-aos-delay="900" data-aos-easing="linear"/>
                                    <div class="relative" data-aos="zoom-in" data-aos-delay="500">
                                        <button data-tooltip="default" data-tooltip-content="$199.99" class="absolute items-center justify-center hidden bg-white rounded-full size-8 xl:flex bottom-20 text-slate-800 left-20"><i data-lucide="plus"></i></button>
                                        <img src="assets/images/product-home.png" alt="" class="mx-auto"/>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Welcome