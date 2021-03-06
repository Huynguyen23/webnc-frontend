import { Modal, Button, Form } from 'antd';
import Swal from 'sweetalert2';
import OTPInput, { ResendOTP } from '../../../lib';
import React, { useState } from 'react';
import { useAuth } from '../../Routes/Context';
import { getOTP, verify, inPay } from '../../../Reducers/Actions/Bank';
import { addReceiver } from '../../../Reducers/Receiver.reducer';
import store from '../../../Store/store';
import './OTPModal.css';
const OTPModal = props => {
  const info = JSON.parse(localStorage.getItem('tokens'));
  const { show, handleCancel, clear, value } = props;
  const [loading, setLoading] = useState(false);
  const [OTP, setOTP] = useState("");
  const { setAuthTokens } = useAuth();

  const setTokens = data => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  const onFinish = param => {
    verify({stk_thanh_toan: info.stkThanhToan, ma_otp: OTP}).then(res =>{
     if(res.status > 0){
      inPay(value).then(resInPay => {
        if(resInPay.status > 0){
          Swal.fire('Thông Báo', 'Đã chuyển tiền thành công', "success").then((result) => {
            if (result.value && !resInPay.isExist) {
              Swal.fire({
                title: 'Bạn có muốn lưu thông tin người nhận ?',
                icon:'question',
                showCancelButton: true
              }).then((res1) =>{
                if (res1.value) {
                  var param = resInPay.data;
                  delete param.isExist;
                  addReceiver(param)(store.dispatch).then(res2 => {
                    if (res2.status > 0) {
                      Swal.fire('Thành Công', 'Đã Thêm Người Nhận Thành Công', 'success');
                    } else {
                      Swal.fire('Lỗi', 'Người Nhận Đã Có Trong Danh Sách', 'error');
                    }
                  });
                }
              })
            }});
          info.soDuHienTai = parseInt(info.soDuHienTai) - parseInt(value.so_tien_gui);
          setTokens(info);  
          clear();
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
        />
        <ResendOTP onResendClick={() => getOTP({stk_thanh_toan: info.stkThanhToan})}/>
      </Modal>
  );
};

export default OTPModal;
