import React from 'react'
import Imgs from '../assets/img/hero/hero-2-2.png';
import Img2 from '../assets/img/hero/hero-2-1.jpg';
import bg1 from '../assets/img/hero/hero-bg1-2.jpg';
import Img6 from '../assets/img/hero/hero-1-1.jpg';
import Headers from '../Components/Headers';
import Vids from '../assets/img/hackfu/GreenModernTechnologyCyberSafetyVideo.mp4';
import Img from '../assets/img/hackfu/logo.png';
import { Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

function Home() {
    const { authenticated, ready, login, logout, user } = usePrivy();
    return (
        // <div className='bodyssssss'>
        //     {/* <Headers /> */}



        //     <div className='full-screenssssss'>


        //         <Headers />
        //         <div className='containerssssss'>
        //             <div className='containerssssss welcome'>
        //                 <div className='landingssssss'>
        //                     <div>
        //                         <h1 style={{ textAlign: 'start', fontSize: 5 + 'vw' }}>CIPHER <br /> QUEST</h1>
        //                         <p style={{ textAlign: 'start', width: 50 + '%' }}><b>Greetings, brave adventurer!</b><br />
        //                             You've entered the realm of Cipher Quest, where cunning, wit, and courage pave the way to glory.<br /><br />

        //                             This is no ordinary treasure hunt. Hidden within this world lies the ultimate loot, a prize of untold riches.
        //                             <br />But beware—only one can claim the spoils! To emerge victorious, you must decipher cryptic clues, solve challenging puzzles, and outsmart your rivals at every turn.<br /><br />

        //                             <b>Are you ready to embark on the quest of a lifetime?</b><br />
        //                             The path ahead is treacherous, the stakes are high, and the loot is yours for the taking… if you dare.<br /><br />

        //                             Gear up, adventurer. The treasure awaits. 💎✨<br />
        //                             Let the hunt begin!</p>


        //                     </div>
        //                     <img src={Img} style={{ width: 30 + 'vw' }} />

        //                 </div>

        //             </div>
        //         </div>
        //     </div>

        //     {authenticated && <div className='full-screen-modalssssss'>
        //         <div className='card' style={{padding: 10}}>

        //             <Link to={'/game'} className='btn btn-success btn-lg'>Enter the Arena</Link>
        //         </div>
        //     </div>}
        // </div>

        <div className='vh-100'>
            {/* <Headers /> */}
            {/* <video class="fix-homessssss" autoPlay loop muted>
                                <source src={Vids} type="video/mp4" />

                            </video> */}
                
            <div class="authincation h-100" >
                <div class="container h-100">
                    <div class="row h-100 align-items-center">
                    <div class="" style={{padding: 10+'px', alignItems: 'flex-end', alignSelf: 'flex-end'}}>
                    <nav class="navbar navbar-expand">
                        <div class="collapse navbar-collapse justify-content-between">
                            <div class="header-left">

                            </div>
                            <ul class="header-right">


                                {authenticated ? <li class="nav-item">
                                    <a onClick={logout} class="btn btn-primary d-sm-inline-block d-none">{user?.wallet?.address.slice(0, 10)}<i class="las la-wallet ms-3 scale5"></i></a>
                                </li> : <li class="nav-item">
                                    <a onClick={login} class="btn btn-primary d-sm-inline-block d-none">Connect Wallet<i class="las la-wallet ms-3 scale5"></i></a>
                                </li>}
                            </ul>
                        </div>
                    </nav>
                </div>
                        <div class="col-lg-6">
                            <div class="form-input-content  error-page">
                                <h1 class="error-text text-primary">Cipher Quest</h1>

                                <p><b>Greetings, brave adventurer!</b><br />
                                    You've entered the realm of Cipher Quest, where cunning, wit, and courage pave the way to glory.<br /><br />
                                    <b>Are you ready to embark on the quest of a lifetime?</b><br />
                                    The path ahead is treacherous, the stakes are high, and the loot is yours for the taking… if you dare.<br /><br />

                                    Gear up, adventurer. The treasure awaits. 💎✨<br />
                                    Let the hunt begin!</p>
                                    {authenticated && <a class="btn btn-primary" href="/welcome">Enter the realm</a>}

                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-12">

                            <img class="w-100 move-2" src={Img} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home