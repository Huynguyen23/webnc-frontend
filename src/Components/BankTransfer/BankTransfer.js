/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  Form,
  Table,
  Select,
  Input
} from 'antd';
import {
  InteractionFilled,
  CopyFilled,
} from '@ant-design/icons';
import './BankTransfer.css';
import { getUserInfo } from '../../Reducers/Actions/Users';
import {getOTP, getBankList} from '../../Reducers/Actions/Bank';
import {OTPModal} from './OTPModal';
const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;


export const BankTransfer = props => {
  const {data, getReceiverList} = props;
  const [OTP, setOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({});
  const [isDisable, setIsDisable] = useState(true);
  const [isDisBtn, setIsDisBtn] = useState(true);
  const [bankList, setBankList] = useState([]);
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 6 }
  };
  const info = JSON.parse(localStorage.getItem('tokens'));
  useEffect(() => {
    setLoading(true);
    getReceiverList({stk_nguoi_gui:info.stkThanhToan}).finally(() => {
      setLoading(false);
    });
    getBankList(setBankList);
  }, [getReceiverList, info.stkThanhToan]);
  const onFinish = param => {
    setValue(param);
    getOTP({stk_thanh_toan: info.stkThanhToan, type: 1}); 
    setOTP(!OTP);
  };

  const btnClearHandler = () => {
    setIsDisBtn(true);
    form.resetFields()
  };
  const onChange = () => {
    setIsDisBtn(true);
    getUserInfo({stk_thanh_toan:form.getFieldValue('stk_nguoi_nhan'), id_ngan_hang:form.getFieldValue('id_ngan_hang')}, form.setFieldsValue).then(res=>{
      console.log("res", res);
      const temp ={...res};
      temp.ten_nguoi_nhan = temp.ten;
      form.setFieldsValue(temp);
      if(res.status > 0 || res.status === undefined) {
        setIsDisBtn(false);
      }
    })
  };
  const columns = [
    {
      title: 'Chọn',
      width:'2%',
      align: 'center',
      render: (text, record) => (
        <CopyFilled
          style={{ verticalAlign: 'center' }}
          onClick={() => {
            record.ten = record.ten_goi_nho;
           form.setFieldsValue(record)
          }}
        />
      )
    },
    {
      title: 'Số Tài Khoản',
      dataIndex: 'stk_nguoi_nhan',
      align: 'center',
      editable: true
    },
    {
      title: 'Tên Gợi Nhớ',
      align: 'center',
      dataIndex: 'ten_goi_nho',
      editable: true
    },
    {
      title: 'Ngân Hàng',
      dataIndex: 'ten',
      align: 'center',
      editable: true
    }

  ];
  return (
    <Content
      style={{
        margin: '20px 16px',
        padding: 20,
        borderRadius: '10px'
      }}
    >
      <Row>
        <Col span={18}>
          <Title level={3} style={{color: '#006633'}}>
          <InteractionFilled style={{fontSize:30, marginRight: 10, color: '#009900'}}/>
            CHUYỂN KHOẢN LIÊN NGÂN HÀNG
          </Title>
        </Col>
      </Row>
        <Form form={form} {...layout} onFinish={onFinish} name="control-hooks">
          <Form.Item name="stk_nguoi_gui" label='TÀI KHOẢN THANH TOÁN NGUỒN' initialValue={info.stkThanhToan}>
          <Input readOnly />
          </Form.Item>
          <Form.Item name="id_ngan_hang" label="NGÂN HÀNG" initialValue =''> 
            <Select
             showSearch
             placeholder="Ngân Hàng"
             optionFilterProp="children"
             onChange={()=>setIsDisable(false)}
             filterOption={(input, option) =>
               option.children.toLowerCase().indexOf(input.toLowerCase()) > 0
             }
            >
              {[
                ...bankList?.map(i => i.id !== 0 && (
                  <Option key={i.id} value={i.id}>
                    {i.ten}
                  </Option>
                ))
              ]}
            </Select>
          </Form.Item>
          <Form.Item name="stk_nguoi_nhan" initialValue ='' label="TÀI KHOẢN NGƯỜI NHẬN" required={{message:"Không được để trống"}}>
            <Input disabled= {isDisable} onBlur={onChange}/>
          </Form.Item>
          <Form.Item name="ten_nguoi_nhan" label="TÊN NGƯỜI NHẬN" initialValue =''> 
            <Input disabled= {isDisable} readOnly/>
          </Form.Item>
         
          <Form.Item name="so_tien" initialValue ='' label="SỐ TIỀN GỬI">
            <Input disabled= {isDisable}/>
          </Form.Item>
          <Form.Item name="noi_dung" initialValue ='' label="NỘI DUNG CHUYỂN TIỀN">
            <TextArea disabled= {isDisable}/>
          </Form.Item>
          <Form.Item name="type" label="PHÍ GIAO DỊCH" initialValue = {1}>
          <Select>
            <Option value={1}>Người Chuyển Thanh Toán</Option>
            <Option value={2} >Người Gửi Thanh Toán</Option>
          </Select>
          </Form.Item>
          <Form.Item>
            <Button style={{backgroundColor:"#006600", border:"#006600", color: "#FFFFFF"}} type="primary" htmlType="submit" disabled={isDisBtn}>
              THANH TOÁN
            </Button>
              {OTP && (
                <OTPModal
                  show={OTP}
                  clear={btnClearHandler}
                  handleCancel={() => setOTP(false)}
                  value={value}
                />
              )}
            <Button style={{marginLeft: 20,backgroundColor:"#C0C0C0",color:'#000000',borderRadius:4, border:"#C0C0C0"}} type="primary" onClick={btnClearHandler}>
              LÀM MỚI
            </Button>
          </Form.Item>
        </Form>   
        <Table
        columns={columns}
        dataSource={data.filter(i=>i.id_ngan_hang !== 0)}
        loading={loading}
        rowKey='stk_nguoi_nhan'
        title={()=> "DANH SÁCH NGƯỜI NHẬN"}
      />
    </Content>
  );
};