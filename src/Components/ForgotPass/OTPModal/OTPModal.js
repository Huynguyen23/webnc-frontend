import { Modal, Button, Form } from 'antd';
import Swal from 'sweetalert2';
import OTPInput, { ResendOTP } from '../../../lib';
import useResendOTP from "../../../lib/hooks/resendOTP";
 import OtpInput from 'react-otp-input';
import React, { useState } from 'react';
import { getOTP, verify, inPay } from '../../../Reducers/Actions/Bank';
import './OTPModal.css';
const OTPModal = props => {
  const { show, handleCancel, isClosed, value } = props;
  const [loading, setLoading] = useState(false);
  const [OTP, setOTP] = useState("");
  const onFinish = param => {
    setLoading(true);
    verify({stk_thanh_toan: value, ma_otp: OTP}).then(res =>{
     if(res.status > 0){
      inPay(value).then(res=> {
        if(res.status > 0){
          Swal.fire('Thông Báo', 'Đã Làm Mới Mã Pin Thành Công', "success");
          isClosed(true);
        } else {
          Swal.fire('Lỗi', 'Mã OTP Sai Rồi!!!', "error");
          return;
        }
      });
      handleCancel();
     }
    })
  };
  const [form] = Form.useForm();
  return (
      <Modal
        visible={show}
        width='358px'
        closable={false}
        style={{borderRadius:5}}
        footer={[
            <Button
              formTarget={form}
              htmlType="submit"
              key="btn1"
              type="primary"
              loading={loading}
              onClick={handleCancel}
              style={{height:'50%', backgroundColor:"#C0C0C0",color:'#000000',borderRadius:4, border:"#C0C0C0"}}
            >
              QUAY LẠI
            </Button>,
            <Button
              formTarget={form}
              htmlType="submit"
              key="btn2"
              type="primary"
              loading={loading}
              onClick={onFinish}
              style={{height:'20%', background: '#006600', borderColor: '#006600', borderRadius:5 }}
            >
              XÁC THỰC
            </Button> 
        ]}
      >
        <h3 style={{textAlign:'center', fontWeight:'bolder', color:'#006600'}}>MÃ XÁC THỰC</h3>
        <p style={{textAlign:'center'}}>Vui lòng kiểm tra email và nhập mã xác thực</p>
        <OTPInput
          value={OTP}
          onChange={setOTP}
          autoFocus
          OTPLength={6}
          otpType="number"
          disabled={false}
          secure
        />
        <ResendOTP onResendClick={() => getOTP({stk_thanh_toan: value})}/>
        {/* <OtpInput
          onChange={otp => setOTP(otp)}
          numInputs={6}
          value ={OTP}
          inputStyle="inputStyle"
          separator={<span>-</span>}
        /> */}
      </Modal>
  );
};

export default OTPModal;
