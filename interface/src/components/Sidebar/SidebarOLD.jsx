import React from "react";

export const Sidebar = () => {
  return (
    <>
        <SidebarHeader></SidebarHeader>
        <SidebarContents></SidebarContents>
        <SidebarFooter></SidebarFooter>
    </>
  );
};




const SidebarContents = ()=>{
  return (
    <>
    <button className="btn btn-outline btn-accent gap-2 w-full rounded">
      <svg className="h-6 w-6" stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.1h-56v56C279.1 381.3 269.3 392 256 392c-13.27 0-23.1-10.74-23.1-23.1V311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h56V207.1C232 194.7 242.7 184 256 184s23.1 10.74 23.1 23.1V264h56C349.3 264 360 274.7 360 288S349.3 311.1 336 311.1z"/></svg>
      <span className="group">Investigation</span>
    </button>
    </>  
  )
}

const Logo = ({className})=>{
  return (
    <>
      <svg className="w-12 h-14 pt-0 "                        fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M144.3 32.04C106.9 31.29 63.7 41.44 18.6 61.29c-11.42 5.026-18.6 16.67-18.6 29.15l0 357.6c0 11.55 11.99 19.55 22.45 14.65c126.3-59.14 219.8 11 223.8 14.01C249.1 478.9 252.5 480 256 480c12.4 0 16-11.38 16-15.98V80.04c0-5.203-2.531-10.08-6.781-13.08C263.3 65.58 216.7 33.35 144.3 32.04zM557.4 61.29c-45.11-19.79-88.48-29.61-125.7-29.26c-72.44 1.312-118.1 33.55-120.9 34.92C306.5 69.96 304 74.83 304 80.04v383.1C304 468.4 307.5 480 320 480c3.484 0 6.938-1.125 9.781-3.328c3.925-3.018 97.44-73.16 223.8-14c10.46 4.896 22.45-3.105 22.45-14.65l.0001-357.6C575.1 77.97 568.8 66.31 557.4 61.29z"/></svg>
      <svg className="w-9  h-14 pb-4 -ml-10"
        style={{width: "2.3rem", marginLeft: "-2.7rem"
      }} fill="white"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"/></svg>
      <svg className="w-8  h-14 pb-3 -ml-9 z-10 text-primary" 
      style={{ filter: "drop-shadow(1px 4px 0px white)", marginLeft: "-2.21rem"}}      
      fill="currentColor"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"/></svg>
    </>
)}
{/*
<svg className="w-11 h-14 pt-3 text-indigo-600 " fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="filter: drop-shadow(rgb(31 41 55) 2px 3px 0px);">
  <path d="M144.3 32.04C106.9 31.29 63.7 41.44 18.6 61.29c-11.42 5.026-18.6 16.67-18.6 29.15l0 357.6c0 11.55 11.99 19.55 22.45 14.65c126.3-59.14 219.8 11 223.8 14.01C249.1 478.9 252.5 480 256 480c12.4 0 16-11.38 16-15.98V80.04c0-5.203-2.531-10.08-6.781-13.08C263.3 65.58 216.7 33.35 144.3 32.04zM557.4 61.29c-45.11-19.79-88.48-29.61-125.7-29.26c-72.44 1.312-118.1 33.55-120.9 34.92C306.5 69.96 304 74.83 304 80.04v383.1C304 468.4 307.5 480 320 480c3.484 0 6.938-1.125 9.781-3.328c3.925-3.018 97.44-73.16 223.8-14c10.46 4.896 22.45-3.105 22.45-14.65l.0001-357.6C575.1 77.97 568.8 66.31 557.4 61.29z"></path></svg>
<svg className="w-9 h-14 pb-3 text-indigo-600 stroke-0 -ml-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white" style="
    margin-left: -41px;
    margin-top: 3px;
"><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path></svg>
<svg className="w-8 h-14 pb-3 text-indigo-600 stroke-0 -ml-9 stroke-indigo-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="
    z-index: 10;
    margin-left: -35px;
    margin-top: 5px;
    filter: drop-shadow(0px 5px 0px white);
"><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path></svg>
  */}

const LogoName = ()=>{
  return(
    <h2 className="
    pl-5 pb-2 self-center text-3xl font-black text-neutral-content items-center h-full
    hidden lg:block
    ">
      <span className="underline underline-offset-2">
        Ma<span className="text-indigo-500">DI</span>
      </span>
    </h2>
)}

const SidebarHeader = ()=>{
  return (        
    <div className="flex flex-1 max-h-20 justify-center text-white pb-5">
      <Logo/>
      <LogoName/>
    </div>
  )
}

const SidebarFooter = ()=>{
  return (<div className="hidden md:block">Footer</div>)
}
