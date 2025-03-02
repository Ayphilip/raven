import React, { useEffect, useState } from 'react'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { useLoginService } from '../services/authenticationService';
import { useNavigate, useParams } from 'react-router-dom';
import Sidbar from '../Components/Sidbar';
import { useOthers } from '../context/otherContext';

function Swap() {
    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();

    const [minting, setMinting] = useState(false)
    const [userData, setUserData] = useState(null)



    // const fileInputRef = useRef(null);
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();
    const { nft, ptoken, tokenBal, makeTransfer, loadingOthers, mintNft } = useOthers()

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [tweet, setTweet] = useState(null)

    const params = useParams()


    useEffect(() => {


        return () => {

        }
    }, [userDetails])
    return (

        <div id='wrapper'>

            <Sidbar ps={7} />

            <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">

                <div class="max-w-4xl mx-auto max-lg:px-4">


                    <div class="lg:py-20 py-12">
                        <div class="text-center">
                            {/* <ion-icon name="sparkles-sharp" class="text-5xl mb-6 text-sky-500 opacity-70 rotate-12"></ion-icon> */}
                            <h1 class="lg:text-5xl lg:font-bold md:text-3xl text-xl font-semibold bg-gradient-to-tr from-indigo-500 to-sky-400 bg-clip-text !text-transparent leading-relaxed"> Swap Tokens</h1>
                            <p class="text-sm text-gray-500 mt-2 dark:text-white/80"> Feature coming soon, Stay tuned. </p>
                        </div>



                        <div class="relative lg:mt-12 mt-8 max-w-2xl mx-auto" tabindex="-1" uk-slider="finite: true">

                            <div class="overflow-hidden uk-slider-container py-2">

                                <ul class="-ml-2 uk-slider-items w-[calc(100%+10px)]" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                </ul>

                            </div>



                        </div>





                        <div class="py-10 flex justify-between">

                            <p class="max-w-xl mx-auto text-center text-sm text-gray-500dark:text-white/80"> Raven Swap enables seamless bridging and swapping between different tokens efficiently and securely. </p>

                        </div>


                    </div>


                </div>

            </main>

        </div>
    )
}

export default Swap