const axios = require('axios');
const { response } = require('../Helper/Helper');

exports.createMeeting = async (req, res) => {
    try {
       
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=OEuKEJQuRIS_w-EnWWfNzw',
            headers: {
                'Authorization': 'Basic MGVGaGI1OEJTRWFCQ2UwVFE4VlBMZzpCRDdGcjU3eHhBek5mZXJDWTNaTmVzSmtPYjdndnppQw==',
                'Cookie': '__cf_bm=5LybZS9JTKg3DXHou.nbqsBjKtaskBs0KHOiVhsMTrM-1715157729-1.0.1.1-R69qQDOEeHx3AJjnWJ4slDGuJ.aH0A4dlKM3p0v4KZlVzRCqbvqQ7L9brtAJqT9vmAJ0BXeu4OKYHiKgGKEWuA; _zm_chtaid=192; _zm_csp_script_nonce=qkEugO5DQi-8cfbDVNraCw; _zm_ctaid=YgHd4Ij8Tj22oYJqGO-7oQ.1715157729482.15f16968b561662f99fee2b56bef5795; _zm_currency=INR; _zm_mtk_guid=f01f7a4b1db7461681a6fc09bb1a3448; _zm_page_auth=us05_c_A28M-s6MQ_-e3GJi466Z5A; _zm_ssid=us05_c_BMY-HaM4R2y6kBnGw4y41w; _zm_visitor_guid=f01f7a4b1db7461681a6fc09bb1a3448; cred=601D04A714C5094F3DE97B0D9B15C71B'
            }
        };

        axios.request(config)
            .then((response) => {
                
                let data = JSON.stringify({
                    "topic": "zoom1",
                    "type": 2,
                    "start_time": "2024--30",
                    "duration": 60,
                    "timezone": "America/Mexico_City",
                    "password": "12334"
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.zoom.us/v2/users/me/meetings',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${response.data.access_token}`,
                        'Cookie': '__cf_bm=5LybZS9JTKg3DXHou.nbqsBjKtaskBs0KHOiVhsMTrM-1715157729-1.0.1.1-R69qQDOEeHx3AJjnWJ4slDGuJ.aH0A4dlKM3p0v4KZlVzRCqbvqQ7L9brtAJqT9vmAJ0BXeu4OKYHiKgGKEWuA; _zm_csp_script_nonce=qkEugO5DQi-8cfbDVNraCw; _zm_currency=INR; _zm_mtk_guid=f01f7a4b1db7461681a6fc09bb1a3448; _zm_page_auth=us05_c_A28M-s6MQ_-e3GJi466Z5A; _zm_ssid=us05_c_BMY-HaM4R2y6kBnGw4y41w; _zm_visitor_guid=f01f7a4b1db7461681a6fc09bb1a3448; cred=3115C7B2A4FFE64B34DDE00D61E96088'
                    },
                    data: data
                };

                axios.request(config)
                    .then((response) => {
                        res.send(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });

              
            })
            .catch((error) => {
                console.log(error);
            });

    } catch (error) {
        console.log(error)
        
    }
}

exports.checkLink= async(req,res)=>{
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=OEuKEJQuRIS_w-EnWWfNzw',
            headers: {
                'Authorization': 'Basic MGVGaGI1OEJTRWFCQ2UwVFE4VlBMZzpCRDdGcjU3eHhBek5mZXJDWTNaTmVzSmtPYjdndnppQw==',
                'Cookie': '__cf_bm=5LybZS9JTKg3DXHou.nbqsBjKtaskBs0KHOiVhsMTrM-1715157729-1.0.1.1-R69qQDOEeHx3AJjnWJ4slDGuJ.aH0A4dlKM3p0v4KZlVzRCqbvqQ7L9brtAJqT9vmAJ0BXeu4OKYHiKgGKEWuA; _zm_chtaid=192; _zm_csp_script_nonce=qkEugO5DQi-8cfbDVNraCw; _zm_ctaid=YgHd4Ij8Tj22oYJqGO-7oQ.1715157729482.15f16968b561662f99fee2b56bef5795; _zm_currency=INR; _zm_mtk_guid=f01f7a4b1db7461681a6fc09bb1a3448; _zm_page_auth=us05_c_A28M-s6MQ_-e3GJi466Z5A; _zm_ssid=us05_c_BMY-HaM4R2y6kBnGw4y41w; _zm_visitor_guid=f01f7a4b1db7461681a6fc09bb1a3448; cred=601D04A714C5094F3DE97B0D9B15C71B'
            }
        };

        axios.request(config).then(async(response)=>{
            const meetingId = '889 2979 7652';
        const url = `https://api.zoom.us/v2/meetings/${meetingId}`;

           var token = response.data.access_token
           await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const meeting = response.data;
        console.log('Meeting Details:', meeting);

        if (meeting.status === 'waiting' || meeting.status === 'started') {
            console.log('Meeting is active.');
        } else {
            console.log('Meeting has expired.');
        }
        })





    } catch (error) {
        console.log(error)
    }
}