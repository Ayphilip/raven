import React, { useEffect, useState } from 'react'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { useLoginService } from '../services/authenticationService';
import { useNavigate, useParams } from 'react-router-dom';
import Sidbar from '../Components/Sidbar';
import { useOthers } from '../context/otherContext';
import { MentionsInput, Mention } from "react-mentions";

function Swap() {
    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { addUser, modifyUser } = useUsers();

    const [minting, setMinting] = useState(false)
    const [userData, setUserData] = useState(null)



    // const fileInputRef = useRef(null);
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();
    const { nft, ptoken, tokenBal, makeTransfer, loadingOthers, mintNft } = useOthers()

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [tweet, setTweet] = useState(null)

    const params = useParams()

    const users = [
        { id: "@haidoo", display: "@haidoo" },
        { id: "@Pump Dumpington", display: "@Pump Dumpington" },
        { id: "@Stonkyboi", display: "@Stonkyboi" },
        { id: "@Futures Rebased", display: "@Futures Rebased" },
        { id: "@Liquidity TheShiller", display: "@Liquidity TheShiller" },
        { id: "@CrownAb", display: "@CrownAb" },
        { id: "@Stake Mempool", display: "@Stake Mempool" },
        { id: "@Fomo Altcoinstein", display: "@Fomo Altcoinstein" },
        { id: "@Bulls PonziScheme", display: "@Bulls PonziScheme" },
        { id: "@Cardano Goxed", display: "@Cardano Goxed" },
        { id: "@Chain Nakamoto", display: "@Chain Nakamoto" },
        { id: "@Private ATHson", display: "@Private ATHson" },
        { id: "@Gas Hashratez", display: "@Gas Hashratez" },
        { id: "@Cex Forkzilla", display: "@Cex Forkzilla" },
        { id: "@Genesis DeFi", display: "@Genesis DeFi" },
        { id: "@Phantom Dumperson", display: "@Phantom Dumperson" },
        { id: "@Moon GasFee", display: "@Moon GasFee" },
        { id: "@Phil", display: "@Phil" },
    ];
    const [content, setContent] = useState("");


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

                        {/* <MentionsInput
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Type @ to mention..."

                            style={{
                                color: "#fff",
                                fontSize: "18px",
                                padding: "12px",
                                width: "100%",
                                borderRadius: "6px",
                                minHeight: "60px",
                                border: "1px solid #333",
                                resize: "none",
                                outline: "none",
                                suggestions: {
                                    list: {
                                      maxHeight: 200,
                                      overflowY: 'auto',
                                    },
                                  },
                            }}
                        >
                            <Mention
                                trigger="@"
                                data={users}
                                displayTransform={(id, display) => `${display}`}

                                renderSuggestion={(suggestion, search, highlighted) => (
                                    <div
                                        
                                        style={{
                                            padding: "10px",
                                            cursor: "pointer",
                                            backgroundColor: highlighted ? "#1DA1F2" : "#222",
                                            color: highlighted ? "#fff" : "#ccc",
                                            borderRadius: "6px",
                                        }}
                                    >
                                        {suggestion.display}
                                    </div>
                                )}
                                style={{

                                    borderRadius: "6px",
                                    boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                                    maxHeight: "150px", // ✅ Fixed height for dropdown
                                    overflowY: "auto",  // ✅ Enables scrolling when overflow
                                    zIndex: 1000,
                                    position: "absolute", // Keeps it positioned correctly
                                }}
                            />
                        </MentionsInput> */}





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