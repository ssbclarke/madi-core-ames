import { useState } from 'react';
import './App.css';
import Navbar from './navbar/navbar';


function App() {
  return (
    <div className="App">
      <Navbar/>
      	<div class="drawer drawer-mobile text-base-content">
          <input id="drawer-toggle" type="checkbox" class="drawer-toggle"/>

          {/* <!-- Main content here --> */}
          <main class="drawer-content bg-base-200 lg:p-8 p-4 space-y-8">
            {/* <!-- navbar / header --> */}
            <header class="navbar bg-base-100 rounded-box shadow-md">
              <div class="flex-1 lg:hidden">
                <label for="drawer-toggle" class="btn btn-ghost btn-square rounded-box">
                  <i class="uil uil-subject text-2xl text-gray-500"></i>
                </label>
              </div>

              <div class="flex-1 hidden lg:block">
                <h3 class="text-lg btn normal-case btn-ghost text-gray-500 btn-disabled">
                  Application Name
                </h3>
              </div>

              <div class="flex-none">
                {/* <!-- theme changer --> */}
                {/* <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-square rounded-box">
                    <i class="uil uil-swatchbook text-2xl text-gray-500"></i>
                  </label>
                  <ul tabindex="0" class="menu menu-compact dropdown-content mt-5 p-2 shadow bg-base-100 rounded-box w-40 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <li><a data-set-theme="light">light</a></li><li><a data-set-theme="dark">dark</a></li><li><a data-set-theme="cupcake">cupcake</a></li><li><a data-set-theme="bumblebee">bumblebee</a></li><li><a data-set-theme="emerald">emerald</a></li><li><a data-set-theme="corporate">corporate</a></li><li><a data-set-theme="synthwave">synthwave</a></li><li><a data-set-theme="retro">retro</a></li><li><a data-set-theme="cyberpunk">cyberpunk</a></li><li><a data-set-theme="valentine">valentine</a></li><li><a data-set-theme="halloween">halloween</a></li><li><a data-set-theme="garden">garden</a></li><li><a data-set-theme="forest">forest</a></li><li><a data-set-theme="aqua">aqua</a></li><li><a data-set-theme="lofi">lofi</a></li><li><a data-set-theme="pastel">pastel</a></li><li><a data-set-theme="fantasy">fantasy</a></li><li><a data-set-theme="wireframe">wireframe</a></li><li><a data-set-theme="black">black</a></li><li><a data-set-theme="luxury">luxury</a></li><li><a data-set-theme="dracula">dracula</a></li><li><a data-set-theme="cmyk">cmyk</a></li><li><a data-set-theme="autumn">autumn</a></li><li><a data-set-theme="business">business</a></li><li><a data-set-theme="acid">acid</a></li><li><a data-set-theme="lemonade">lemonade</a></li><li><a data-set-theme="night">night</a></li><li><a data-set-theme="coffee">coffee</a></li><li><a data-set-theme="winter">winter</a></li>
                  </ul>
                </div> */}

                {/* <!-- notification --> */}
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-square rounded-box">
                    <i class="uil uil-bell text-2xl text-gray-500"></i>
                  </label>
                  <ul tabindex="0" class="menu text-sm dropdown-content mt-5 p-2 shadow bg-base-100 rounded-box w-64 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <li class="border-b border-base-300">
                      <a class="flex justify-between">
                        This is notification example!
                        <span class="uil uil-angle-right"></span>
                      </a>
                    </li>
                    <li class="border-b border-base-300">
                      <a class="flex justify-between">
                        A request need to be reviewed!
                        <span class="uil uil-angle-right"></span>
                      </a>
                    </li>
                    <li>
                      <a class="flex justify-between">
                        Check the latest daily report
                        <span class="uil uil-angle-right"></span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* <!-- user information --> */}
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-circle avatar mt-2 mx-2 shadow">
                    <div class="w-12 rounded-full">
                      <img src="https://api.lorem.space/image/face?hash=33791" />
                    </div>
                  </label>
                  <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Profile</a></li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                  </ul>
                </div>
              </div>
            </header>
          </main>

          {/* <!-- Sidebar content here --> */}
          <aside class="drawer-side">
            <label for="drawer-toggle" class="drawer-overlay"></label>

            <div class="scrollbar-thin scrollbar-thumb-gray-300 bg-base-200 overflow-y-auto overflow-x-hidden w-64 border-r border-base-300">
              <h2 class="text-center mt-12 mb-16 text-3xl font-black"><span class="text-primary">Your</span> Logo</h2>

              <h6 class="font-semibold ml-6">General</h6>
              <ul class="menu p-2 text-gray-500 font-semibold mb-8">
                <li class="active"><a><i class="uil uil-airplay"></i>Home</a></li>
                <li><a><i class="uil uil-table"></i>Tables</a></li>
                <li><a><i class="uil uil-file-edit-alt"></i>Forms</a></li>
                <li><a><i class="uil uil-toggle-on"></i>Buttons</a></li>
              </ul>

              <h6 class="font-semibold ml-6">Misc</h6>
              <ul class="menu p-2 text-gray-500 font-semibold mb-8">
                <li><a><i class="uil uil-file"></i>Blank Page</a></li>
                <li><a><i class="uil uil-signin"></i>Login Page</a></li>
                <li tabindex="0" class="collapse collapse-arrow">
                  <span class="collapse-title">
                    <i class="uil uil-trees"></i>Submenu
                  </span>
                  <div class="collapse-content">
                    <ul class="menu w-full">
                      <li><a><i class="uil uil-angle-double-right"></i>Example 1</a></li>
                      <li><a><i class="uil uil-angle-double-right"></i>Example 2</a></li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
    </div>
  );
}

export default App;
