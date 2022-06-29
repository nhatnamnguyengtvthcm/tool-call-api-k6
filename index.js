import http from 'k6/http';
import { check, group, fail, sleep } from 'k6'
import papaparse from './PapaParse-5.0.2/papaparse.min.js';
// import FormData from 'form-data';
// import {formData} from 'form-data';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

export let options = {
    vus: 20, // số lượng máy ảo tối đa
    iterations: 20 // số lượng thực thi

}
const csvDataCustomer = papaparse.parse(open('./lbv_itemcode_stresstest.csv'), { header: true }).data;
export default function () {

    // wait to start
    // sleep(__VU);
    let data = csvDataCustomer[__VU - 1];
    // let data = csvDataCustomer[1];
    console.log(`VU: ${__VU}  -  ITER: ${__ITER}`);
  
    // const fd = new FormData();
    // console.log("fd1: ", fd);
    // fd.append("user_request", "trongnghia.nguyen");
    // fd.append('name', 'Stress Test');
    // fd.append('permanent_address', '{"address_line": "146", "distric":"50", "province": "58", "country":"242","wards":"897"}');
    // fd.append('id_card', '0938875998');
    // fd.append('postage_address', '{"address_line": "146", "distric":"50", "province": "58", "country":"242","wards":"897"}');
    // fd.append('phone', '096861238');
    // fd.append('email', 'ahihi7@yopmail.com');
    // fd.append('account_bank', '{"id":null, "beneficiary":"la lan", "bank":"9", "branch":"van thanh", "account": "1345765443", "location": "bch"}');
    // fd.append('type_action', 'transaction');
    // fd.append('date_of_birth', '15-06-2022');
    // fd.append('id_card_date_of_issue', '15-06-2022');
    // fd.append('id_card_issue_by', 'TPHCM');
    // fd.append('nationality_id', '242');
    // fd.append('gender', 'MALE');
    // fd.append('id_card_type', 'CM');
    // fd.append('agent_id', '163');
    // fd.append('item_code', data['item_code']);
    // console.log("----fd: ", fd);
    // console.log("fd body: ", fd.body());
    
    let fd = new FormData();
    // let payload = JSON.stringify(
    //     {
    //         'user_request': 'trongnghia.nguyen',
    //         'name': 'Stress Test',
    //         'permanent_address': '{"address_line": "146", "distric":"50", "province": "58", "country":"242","wards":"897"}',
    //         'id_card': '0938875998',
    //         'postage_address': '{"address_line": "146", "distric":"50", "province": "58", "country":"242","wards":"897"}', 
    //         'phone': '096861238',
    //         'email': 'ahihi7@yopmail.com',
    //         'account_bank': '{"id":null, "beneficiary":"la lan", "bank":"9", "branch":"van thanh", "account": "1345765443", "location": "bch"}',
    //         'type_action':'transaction',
    //         'date_of_birth': '15-06-2022',
    //         'id_card_date_of_issue': '15-06-2022',
    //         'id_card_issue_by': 'TPHCM',
    //         'nationality_id':'242',
    //         'gender': 'MALE',
    //         'id_card_type': 'CM',
    //         'agent_id': '163',
    //         'item_code': data['item_code'],
            
        
    // }

    // )
    let permanent_address =  JSON.stringify({address_line: "146", district:"50", province: "58", country:"242",wards:"897"});
    let account_bank = JSON.stringify({id:null, beneficiary:"la lan", bank:"9", branch:"van thanh", account: "1345765443", location: "bch"})
    let body =
        {
            user_request: 'trongnghia.nguyen',
            name: 'Stress Test',
            permanent_address: '{"address_line": "146", "district":"50", "province": "58", "country":"242","wards":"897"}',
            id_card: '0938875998',
            postage_address: '{"address_line": "146", "district":"50", "province": "58", "country":"242","wards":"897"}', 
            phone: '096861238',
            email: 'ahihi7@yopmail.com',
            account_bank: '{"id":null, "beneficiary":"la lan", "bank":"9", "branch":"van thanh", "account": "1345765443", "location": "bch"}',
            type_action:'transaction',
            date_of_birth: '15-06-2022',
            id_card_date_of_issue: '15-06-2022',
            id_card_issue_by: 'TPHCM',
            nationality_id:'242',
            gender: 'MALE',
            id_card_type: 'CM',
            agent_id: '163',
            item_code: data['item_code'],
            
        
    }
    
    Object.keys(body).forEach((key) => {
        fd.append(key, body[key])
    });
    // fd.append("body:", body);
    console.log("******fd****: ", fd);
    console.log("******fd****: ", fd.body());
    let params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic c2FsZXNfdGVzdDpzYWxlc190ZXN0',
            'Content-Type': 'multipart/form-data;boundary=' + fd.boundary,   
            // 'Content-Type': 'x-www-form-urlencoded',   
        }
    }

    let res = http.post('https://crm-test-lumiere.masterisehomes.com/vin/booking-info', fd.body(), params)

    let isBookingSuccessfully;
    group('booking', function () {
        isBookingSuccessfully = check(res, {
            'Booking successfully': (r) => r.status === 200 && JSON.parse(r.body).result === 1
        })
        if (!isBookingSuccessfully) {
            console.log(JSON.parse(res.body));
            // console.log("fd body: ", payload);
            // console.log("payload: ", payload);
            if (res.status === 200 && JSON.parse(res.body).result !== 1) console.error('Booking fail - ' +  JSON.parse(res.body).message)
            if (res.status !== 200) console.error('Booking error - status code ' + res.status + ' - ' + res.status + ' - ' + res.message + ' - ' + fd)
        }
    })

}