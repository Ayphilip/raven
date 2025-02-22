import React, { useEffect, useState } from 'react'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { usePrivy } from '@privy-io/react-auth';
import { useLoginService } from '../services/authenticationService';
import { useNavigate, useParams } from 'react-router-dom';
import Sidbar from '../Components/Sidbar';
import { useOthers } from '../context/otherContext';

function Premium() {

    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();



    // const fileInputRef = useRef(null);

    const { ready, login, logout, authenticated, user } = usePrivy();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();
    const {nft, ptoken, tokenBal, makeTransfer, loadingOthers} = useOthers()

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [tweet, setTweet] = useState(null)

    const params = useParams()

    const transferFund = (amount) => {
        const data = {
            from: userDetails?.username,
            amount: amount,
            to: '',
            symbol: ptoken
        }
        const response = makeTransfer(data)
        if(response){
            alert('Successfull')
            const dats = {verfied: true}
            const resp = modifyUser(userDetails?.username, dats)
            if(resp){
                window.location.reload()
            }
        }
    }


    // const saveRetweet = (tweetId) => {
    //     // alert('Here')
    //     retweetTweet(tweetId, userDetails?.username)
    // }

    // console.log(params)

    if (ready && !authenticated || !authenticate) {
        // console.log(user)
        navigate('/login')
    }


    useEffect(() => {
        

        return () => {

        }
    }, [tweets, retweetTweet])
    return (
        <div id='wrapper'>

            <Sidbar ps={4} />

            <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">

                <div class="max-w-4xl mx-auto max-lg:px-4">


                    <div class="lg:py-20 py-12">
                        <div class="text-center">
                            {/* <ion-icon name="sparkles-sharp" class="text-5xl mb-6 text-sky-500 opacity-70 rotate-12"></ion-icon> */}
                            <h1 class="lg:text-5xl lg:font-bold md:text-3xl text-xl font-semibold bg-gradient-to-tr from-indigo-500 to-sky-400 bg-clip-text !text-transparent leading-relaxed">  Get Raven Verified</h1>
                            <p class="text-sm text-gray-500 mt-2 dark:text-white/80"> Exclusive features and benefits on Raven are accessible to you. </p>
                        </div>



                        <div class="relative lg:mt-12 mt-8 max-w-2xl mx-auto" tabindex="-1" uk-slider="finite: true">

                            <div class="overflow-hidden uk-slider-container py-2">

                                <ul class="-ml-2 uk-slider-items w-[calc(100%+10px)]" style={{alignItems: 'center', justifyContent: 'center'}}>

                                    

                                    <li class="lg:w-1/3 w-1/2 pr-[10px]">
                                        <label for="weekly">
                                            {nft.filter(nf => nf.name === 'TESTNFT').map(nf => 
                                                <img src={nf.base_uri} className=''/>
                                            )}
                                            <input type="radio" name="radio-membership" id="weekly" class="peer appearance-none hidden" checked />
                                            {tokenBal < 500 ? <div class="relative p-4 bg-white shadow -sm rounded-xl cursor-pointer peer-checked:[&_.active]:block dark:bg-dark3">
                                                <div class="mb-4 text-sm"> Mint TESTNFT</div>
                                                <h2 class="text-3xl font-bold text-black relative px-2 dark:text-white"> <span class="text-sm absolute top-1.5 -left-1 font-normal text-gray-700"></span> 500 {ptoken} </h2>
                                                <ion-icon name="checkmark-circle" class="hidden active absolute top-0 right-0 m-4 text-2xl text-blue-600 uk-animation-scale-up"></ion-icon>
                                            </div> : <div onClick={()=>transferFund(500)} class="relative p-4 bg-white shadow -sm rounded-xl cursor-pointer peer-checked:[&_.active]:block dark:bg-dark3">
                                                <div class="mb-4 text-sm"> Mint TESTNFT</div>
                                                <h2 class="text-3xl font-bold text-black relative px-2 dark:text-white"> <span class="text-sm absolute top-1.5 -left-1 font-normal text-gray-700"></span> 500 {ptoken} </h2>
                                                <ion-icon name="checkmark-circle" class="hidden active absolute top-0 right-0 m-4 text-2xl text-blue-600 uk-animation-scale-up"></ion-icon>
                                            </div>}
                                            {loadingOthers && <div>Please wait, while your transaction is processing</div>}
                                            {tokenBal < 500 && <p className='text-red-500'>Not Enough Token</p>}
                                        </label>
                                    </li>
                                </ul>

                            </div>


                            
                        </div>


                        


                        <div class="py-10 flex justify-between">

                            <p class="max-w-xl mx-auto text-center text-sm text-gray-500dark:text-white/80"> Raven Premium is the ultimate way to enhance your Raven experience and connect with your passions. </p>

                        </div>


                    </div>


                </div>

            </main>

        </div>
    )
}

export default Premium