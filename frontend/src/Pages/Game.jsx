import React, { useEffect, useState } from "react";
import Headers from "../Components/Headers";
import { usePrivy } from "@privy-io/react-auth";
import useWindowFocusEffect from "../Components/useWindowFocus";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import CryptoJS from 'crypto-js';


const GameInterface = () => {
    const [encryptedText, setEncryptedText] = useState('');
    const [password, setPassword] = useState(["", "", "", "", ""]); // Password input state
    const [lobbyInfo, setLobbyInfo] = useState({
        totalPlayers: 24,
        prizePool: "500",
        key: '1024',
        pass: 'loyalty',
        hints: ["Hint 1: Starts with A", "Hint 2: Ends with Z"],
    });
    const { ready, login, logout, authenticated, user } = usePrivy();

    const [collapsed, setCollapsed] = useState(false);

    const { id } = useParams();



    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    }

    const navigate = useNavigate();

    const handleKeyPress = (char, index) => {
        const nextPassword = [...password];
        // const emptyIndex = nextPassword.indexOf(index ? index : "");
        // if (emptyIndex !== -1) {
        nextPassword[index] = char;
        setPassword(nextPassword);
        // }
    };

    const handleBackspace = () => {
        const nextPassword = [...password];
        const lastFilledIndex = nextPassword.lastIndexOf("");
        if (lastFilledIndex === -1) {
            nextPassword[nextPassword.length - 1] = "";
        } else if (lastFilledIndex > 0) {
            nextPassword[lastFilledIndex - 1] = "";
        }
        setPassword(nextPassword);
    };

    const handleClear = () => {
        const inputString = lobbyInfo.pass;

        // Generate an array with empty values for each character in the string
        const emptyArray = inputString.split("").map(() => "");

        setPassword(emptyArray);
    };

    const checkpass = () => {
        const passwordString = password.join("");
        if (lobbyInfo.pass === passwordString) {
            alert('You are the best')
        } else {
            alert('Almost There, Nearly')
        }
    }

    useWindowFocusEffect((state) => {
        if (state === "focus") {
            console.log("Window is focused");
            // Perform actions when the window gains focus

        } else if (state === "blur") {
            console.log("Window lost focus");
            // Perform actions when the window loses focus
        }
    });

    useEffect(() => {
        if (ready && !authenticated) {
            navigate('/')
        }
        const inputString = lobbyInfo.pass;
        setEncryptedText(CryptoJS.AES.encrypt(lobbyInfo.pass, lobbyInfo.key).toString())

        // Generate an array with empty values for each character in the string
        const emptyArray = inputString.split("").map(() => "");

        setPassword(emptyArray);

        return () => {

        }
    }, [login, logout, user])



    return (

        ready && authenticated &&
        <>
            <Sidebar />
            <div id="">

                <div class="content-body">

                    <div class="container-fluid">


                        <div class="row">


                            <div class="col-xl-9 col-xxl-12">

                                <div class="row align-items-center">
                                    <div class="col-xl-12">
                                        <div class="card coin-card">

                                            <span class='btn btn-primary'>Guess the password: <strong>{encryptedText}</strong></span>
                                            <div class="card-body d-sm-flex d-block align-items-center">

                                                <div className='row'>
                                                    {password.map((pass, index) =>
                                                        <input class="coin-icon" key={index} style={{ fontSize: 40, textTransform: "capitalize" }} maxLength={1} value={password[index]} onChange={(e) => handleKeyPress(e.target.value, index)} />
                                                    )}



                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6" style={{ cursor: 'pointer' }} onClick={checkpass}>
                                        <div class="card progress-card">
                                            <div class="card-body d-flex">
                                                <div class="me-auto">
                                                    <h4 class="card-title">Check Password</h4>

                                                </div>

                                                <div class="" style={{ minHeight: 110 + "px", minWidth: 10 + "px" }}>
                                                    <i className='fa-solid fa-check' style={{ fontSize: 60 + 'px', color: 'lightblue' }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6" style={{ cursor: 'pointer' }} onClick={handleClear}>
                                        <div class="card progress-card">
                                            <div class="card-body d-flex">
                                                <div class="me-auto">
                                                    <h4 class="card-title">Clear All</h4>

                                                </div>

                                                <div class="" style={{ minHeight: 110 + "px", minWidth: 10 + "px" }}>
                                                    <i className='fa-solid fa-times' style={{ fontSize: 60 + 'px', color: 'lightcoral' }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                </div>
                            </div>


                            <div class="col-xl-3 col-xxl-5">
                                <div class="card-bx bg-blue">
                                    <img class="pattern-img" src="https://dompet.dexignlab.com/codeigniter/demo/public/assets/images/pattern/pattern6.png" alt="" />
                                    <div class="card-info text-white">
                                        <img src="https://dompet.dexignlab.com/codeigniter/demo/public/assets/images/pattern/circle.png" class="mb-4" alt="" />
                                        <h2 class="text-white card-balance">${parseFloat(lobbyInfo.prizePool).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                        <p class="fs-16">Pot Balance</p>
                                        {/* <span>+0,8% than last week</span> */}
                                    </div>
                                </div>
                            </div>





                            <div class="col-xl-9 col-xxl-12">
                                <div class="card">
                                    <div class="card-header d-block d-sm-flex border-0">
                                        <div class="me-3">
                                            <h4 class="card-title mb-2">Hints Purchased</h4>
                                            <span class="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
                                        </div>
                                        <div class="card-tabs mt-3 mt-sm-0">
                                            <ul class="nav nav-tabs" role="tablist">
                                                <li class="nav-item">
                                                    <a class="nav-link active" data-bs-toggle="tab" href="#monthly" role="tab">Monthly</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="card-body tab-content p-0">
                                        <div class="tab-pane active show fade" id="monthly" role="tabpanel">
                                            <div class="table-responsive">
                                                <table class="table table-responsive-md card-table transactions-table">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <svg class="bgl-success tr-icon" width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g><path d="M35.2219 42.9875C34.8938 42.3094 35.1836 41.4891 35.8617 41.1609C37.7484 40.2531 39.3453 38.8422 40.4828 37.0758C41.6477 35.2656 42.2656 33.1656 42.2656 31C42.2656 24.7875 37.2125 19.7344 31 19.7344C24.7875 19.7344 19.7344 24.7875 19.7344 31C19.7344 33.1656 20.3523 35.2656 21.5117 37.0813C22.6437 38.8477 24.2461 40.2586 26.1328 41.1664C26.8109 41.4945 27.1008 42.3094 26.7727 42.993C26.4445 43.6711 25.6297 43.9609 24.9461 43.6328C22.6 42.5063 20.6148 40.7563 19.2094 38.5578C17.7656 36.3047 17 33.6906 17 31C17 27.2594 18.4547 23.743 21.1016 21.1016C23.743 18.4547 27.2594 17 31 17C34.7406 17 38.257 18.4547 40.8984 21.1016C43.5453 23.7484 45 27.2594 45 31C45 33.6906 44.2344 36.3047 42.7852 38.5578C41.3742 40.7508 39.3891 42.5063 37.0484 43.6328C36.3648 43.9555 35.55 43.6711 35.2219 42.9875Z" fill="#2BC155"></path><path d="M36.3211 31.7274C36.5891 31.9953 36.7203 32.3453 36.7203 32.6953C36.7203 33.0453 36.5891 33.3953 36.3211 33.6633L32.8812 37.1031C32.3781 37.6063 31.7109 37.8797 31.0055 37.8797C30.3 37.8797 29.6273 37.6008 29.1297 37.1031L25.6898 33.6633C25.1539 33.1274 25.1539 32.2633 25.6898 31.7274C26.2258 31.1914 27.0898 31.1914 27.6258 31.7274L29.6437 33.7453L29.6437 25.9742C29.6437 25.2196 30.2562 24.6071 31.0109 24.6071C31.7656 24.6071 32.3781 25.2196 32.3781 25.9742L32.3781 33.7508L34.3961 31.7328C34.9211 31.1969 35.7852 31.1969 36.3211 31.7274Z" fill="#2BC155"></path>
                                                                    </g>
                                                                </svg>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 font-w600 mb-0"><a class="text-black">XYZ Store ID</a></h6>
                                                                <span class="fs-14">Cashback</span>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 text-black font-w600 mb-0">June 4, 2020</h6>
                                                                <span class="fs-14">05:34:45 AM</span>
                                                            </td>
                                                            <td><span class="fs-16 text-black font-w600">+$5,553</span></td>
                                                            <td><span class="text-success fs-16 font-w500 text-end d-block">Completed</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <svg class="bgl-danger tr-icon" width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g><path d="M35.2219 19.0125C34.8937 19.6906 35.1836 20.5109 35.8617 20.8391C37.7484 21.7469 39.3453 23.1578 40.4828 24.9242C41.6476 26.7344 42.2656 28.8344 42.2656 31C42.2656 37.2125 37.2125 42.2656 31 42.2656C24.7875 42.2656 19.7344 37.2125 19.7344 31C19.7344 28.8344 20.3523 26.7344 21.5117 24.9187C22.6437 23.1523 24.2461 21.7414 26.1328 20.8336C26.8109 20.5055 27.1008 19.6906 26.7726 19.007C26.4445 18.3289 25.6297 18.0391 24.9461 18.3672C22.6 19.4937 20.6148 21.2437 19.2094 23.4422C17.7656 25.6953 17 28.3094 17 31C17 34.7406 18.4547 38.257 21.1015 40.8984C23.743 43.5453 27.2594 45 31 45C34.7406 45 38.257 43.5453 40.8984 40.8984C43.5453 38.2516 45 34.7406 45 31C45 28.3094 44.2344 25.6953 42.7851 23.4422C41.3742 21.2492 39.389 19.4937 37.0484 18.3672C36.3648 18.0445 35.55 18.3289 35.2219 19.0125Z" fill="#FF2E2E"></path><path d="M36.3211 30.2726C36.589 30.0047 36.7203 29.6547 36.7203 29.3047C36.7203 28.9547 36.589 28.6047 36.3211 28.3367L32.8812 24.8969C32.3781 24.3937 31.7109 24.1203 31.0055 24.1203C30.3 24.1203 29.6273 24.3992 29.1297 24.8969L25.6898 28.3367C25.1539 28.8726 25.1539 29.7367 25.6898 30.2726C26.2258 30.8086 27.0898 30.8086 27.6258 30.2726L29.6437 28.2547L29.6437 36.0258C29.6437 36.7804 30.2562 37.3929 31.0109 37.3929C31.7656 37.3929 32.3781 36.7804 32.3781 36.0258L32.3781 28.2492L34.3961 30.2672C34.9211 30.8031 35.7851 30.8031 36.3211 30.2726Z" fill="#FF2E2E"></path></g>
                                                                </svg>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 font-w600 mb-0"><a class="text-black">Chef Renata</a></h6>
                                                                <span class="fs-14">Transfer</span>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 text-black font-w600 mb-0">June 5, 2020</h6>
                                                                <span class="fs-14">05:34:45 AM</span>
                                                            </td>
                                                            <td><span class="fs-16 text-black font-w600">-$167</span></td>
                                                            <td><span class="text-warning fs-16 font-w500 text-end d-block">Pending</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <svg class="bgl-success tr-icon" width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g><path d="M35.2219 42.9875C34.8938 42.3094 35.1836 41.4891 35.8617 41.1609C37.7484 40.2531 39.3453 38.8422 40.4828 37.0758C41.6477 35.2656 42.2656 33.1656 42.2656 31C42.2656 24.7875 37.2125 19.7344 31 19.7344C24.7875 19.7344 19.7344 24.7875 19.7344 31C19.7344 33.1656 20.3523 35.2656 21.5117 37.0813C22.6437 38.8477 24.2461 40.2586 26.1328 41.1664C26.8109 41.4945 27.1008 42.3094 26.7727 42.993C26.4445 43.6711 25.6297 43.9609 24.9461 43.6328C22.6 42.5063 20.6148 40.7563 19.2094 38.5578C17.7656 36.3047 17 33.6906 17 31C17 27.2594 18.4547 23.743 21.1016 21.1016C23.743 18.4547 27.2594 17 31 17C34.7406 17 38.257 18.4547 40.8984 21.1016C43.5453 23.7484 45 27.2594 45 31C45 33.6906 44.2344 36.3047 42.7852 38.5578C41.3742 40.7508 39.3891 42.5063 37.0484 43.6328C36.3648 43.9555 35.55 43.6711 35.2219 42.9875Z" fill="#2BC155"></path><path d="M36.3211 31.7274C36.5891 31.9953 36.7203 32.3453 36.7203 32.6953C36.7203 33.0453 36.5891 33.3953 36.3211 33.6633L32.8812 37.1031C32.3781 37.6063 31.7109 37.8797 31.0055 37.8797C30.3 37.8797 29.6273 37.6008 29.1297 37.1031L25.6898 33.6633C25.1539 33.1274 25.1539 32.2633 25.6898 31.7274C26.2258 31.1914 27.0898 31.1914 27.6258 31.7274L29.6437 33.7453L29.6437 25.9742C29.6437 25.2196 30.2562 24.6071 31.0109 24.6071C31.7656 24.6071 32.3781 25.2196 32.3781 25.9742L32.3781 33.7508L34.3961 31.7328C34.9211 31.1969 35.7852 31.1969 36.3211 31.7274Z" fill="#2BC155"></path>
                                                                    </g>
                                                                </svg>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 font-w600 mb-0"><a class="text-black">Cindy Alexandro</a></h6>
                                                                <span class="fs-14">Transfer</span>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 text-black font-w600 mb-0">June 5, 2020</h6>
                                                                <span class="fs-14">05:34:45 AM</span>
                                                            </td>
                                                            <td><span class="fs-16 text-black font-w600">+$5,553</span></td>
                                                            <td><span class="text-danger fs-16 font-w500 text-end d-block">Canceled</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <svg class="bgl-success tr-icon" width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g><path d="M35.2219 42.9875C34.8938 42.3094 35.1836 41.4891 35.8617 41.1609C37.7484 40.2531 39.3453 38.8422 40.4828 37.0758C41.6477 35.2656 42.2656 33.1656 42.2656 31C42.2656 24.7875 37.2125 19.7344 31 19.7344C24.7875 19.7344 19.7344 24.7875 19.7344 31C19.7344 33.1656 20.3523 35.2656 21.5117 37.0813C22.6437 38.8477 24.2461 40.2586 26.1328 41.1664C26.8109 41.4945 27.1008 42.3094 26.7727 42.993C26.4445 43.6711 25.6297 43.9609 24.9461 43.6328C22.6 42.5063 20.6148 40.7563 19.2094 38.5578C17.7656 36.3047 17 33.6906 17 31C17 27.2594 18.4547 23.743 21.1016 21.1016C23.743 18.4547 27.2594 17 31 17C34.7406 17 38.257 18.4547 40.8984 21.1016C43.5453 23.7484 45 27.2594 45 31C45 33.6906 44.2344 36.3047 42.7852 38.5578C41.3742 40.7508 39.3891 42.5063 37.0484 43.6328C36.3648 43.9555 35.55 43.6711 35.2219 42.9875Z" fill="#2BC155"></path><path d="M36.3211 31.7274C36.5891 31.9953 36.7203 32.3453 36.7203 32.6953C36.7203 33.0453 36.5891 33.3953 36.3211 33.6633L32.8812 37.1031C32.3781 37.6063 31.7109 37.8797 31.0055 37.8797C30.3 37.8797 29.6273 37.6008 29.1297 37.1031L25.6898 33.6633C25.1539 33.1274 25.1539 32.2633 25.6898 31.7274C26.2258 31.1914 27.0898 31.1914 27.6258 31.7274L29.6437 33.7453L29.6437 25.9742C29.6437 25.2196 30.2562 24.6071 31.0109 24.6071C31.7656 24.6071 32.3781 25.2196 32.3781 25.9742L32.3781 33.7508L34.3961 31.7328C34.9211 31.1969 35.7852 31.1969 36.3211 31.7274Z" fill="#2BC155"></path>
                                                                    </g>
                                                                </svg>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 font-w600 mb-0"><a class="text-black">Paipal</a></h6>
                                                                <span class="fs-14">Transfer</span>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 text-black font-w600 mb-0">June 4, 2020</h6>
                                                                <span class="fs-14">05:34:45 AM</span>
                                                            </td>
                                                            <td><span class="fs-16 text-black font-w600">+$5,553</span></td>
                                                            <td><span class="text-success fs-16 font-w500 text-end d-block">Completed</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <svg class="bgl-danger tr-icon" width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g><path d="M35.2219 19.0125C34.8937 19.6906 35.1836 20.5109 35.8617 20.8391C37.7484 21.7469 39.3453 23.1578 40.4828 24.9242C41.6476 26.7344 42.2656 28.8344 42.2656 31C42.2656 37.2125 37.2125 42.2656 31 42.2656C24.7875 42.2656 19.7344 37.2125 19.7344 31C19.7344 28.8344 20.3523 26.7344 21.5117 24.9187C22.6437 23.1523 24.2461 21.7414 26.1328 20.8336C26.8109 20.5055 27.1008 19.6906 26.7726 19.007C26.4445 18.3289 25.6297 18.0391 24.9461 18.3672C22.6 19.4937 20.6148 21.2437 19.2094 23.4422C17.7656 25.6953 17 28.3094 17 31C17 34.7406 18.4547 38.257 21.1015 40.8984C23.743 43.5453 27.2594 45 31 45C34.7406 45 38.257 43.5453 40.8984 40.8984C43.5453 38.2516 45 34.7406 45 31C45 28.3094 44.2344 25.6953 42.7851 23.4422C41.3742 21.2492 39.389 19.4937 37.0484 18.3672C36.3648 18.0445 35.55 18.3289 35.2219 19.0125Z" fill="#FF2E2E"></path><path d="M36.3211 30.2726C36.589 30.0047 36.7203 29.6547 36.7203 29.3047C36.7203 28.9547 36.589 28.6047 36.3211 28.3367L32.8812 24.8969C32.3781 24.3937 31.7109 24.1203 31.0055 24.1203C30.3 24.1203 29.6273 24.3992 29.1297 24.8969L25.6898 28.3367C25.1539 28.8726 25.1539 29.7367 25.6898 30.2726C26.2258 30.8086 27.0898 30.8086 27.6258 30.2726L29.6437 28.2547L29.6437 36.0258C29.6437 36.7804 30.2562 37.3929 31.0109 37.3929C31.7656 37.3929 32.3781 36.7804 32.3781 36.0258L32.3781 28.2492L34.3961 30.2672C34.9211 30.8031 35.7851 30.8031 36.3211 30.2726Z" fill="#FF2E2E"></path></g>
                                                                </svg>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 font-w600 mb-0"><a class="text-black">Hawkins Jr.</a></h6>
                                                                <span class="fs-14">Cashback</span>
                                                            </td>
                                                            <td>
                                                                <h6 class="fs-16 text-black font-w600 mb-0">June 4, 2020</h6>
                                                                <span class="fs-14">05:34:45 AM</span>
                                                            </td>
                                                            <td><span class="fs-16 text-black font-w600">+$5,553</span></td>
                                                            <td><span class="text-danger fs-16 font-w500 text-end d-block">Canceled</span></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>




                            <div class="col-xl-3 col-xxl-7">
                                <div class="card">
                                    <div class="card-header border-0 pb-0">
                                        <div>
                                            <h4 class="card-title mb-2">Lobby Name</h4>
                                            <span class="fs-12">Type of game available in lobby</span>
                                        </div>

                                    </div>
                                    <div class="card-body">

                                        <h4 class="mt-3 mb-3">Inside lobby<a class="fs-16 float-end text-secondary font-w600"></a></h4>
                                        <ul class="user-list">
                                            <li><img src="https://dompet.dexignlab.com/codeigniter/demo/public/assets/images/avatar/1.jpg" alt="" /></li>
                                            <li><img src="https://dompet.dexignlab.com/codeigniter/demo/public/assets/images/avatar/2.jpg" alt="" /></li>
                                            <li><img src="https://dompet.dexignlab.com/codeigniter/demo/public/assets/images/avatar/3.jpg" alt="" /></li>
                                            <li><img src="https://dompet.dexignlab.com/codeigniter/demo/public/assets/images/avatar/4.jpg" alt="" /></li>
                                            <li><img src="https://dompet.dexignlab.com/codeigniter/demo/public/assets/images/avatar/5.jpg" alt="" /></li>
                                            <li><img src="https://dompet.dexignlab.com/codeigniter/demo/public/assets/images/avatar/6.jpg" alt="" /></li>
                                        </ul>

                                    </div>
                                    <div class="card-footer border-0 pt-0">
                                        <h4 class="mt-3 mb-0">Insert Number of Ticket</h4>
                                        <div class="format-slider">
                                            <input class="form-control amount-input" placeholder='Ticket' title="Formatted number" id="input-format" />
                                            <div id="slider-format"></div>
                                        </div>
                                        <a class="btn btn-primary d-block btn-lg text-uppercase">Buy Ticket</a>
                                    </div>
                                </div>
                            </div>




                        </div>

                    </div>
                </div>

            </div> </>
    );
};

export default GameInterface;
