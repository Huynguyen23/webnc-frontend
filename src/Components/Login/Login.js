import React, { useState } from 'react';
import { LockOutlined, NumberOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Form, Input, Button } from 'antd';
import ReCAPTCHA from "react-google-recaptcha";
import Swal from 'sweetalert2';
import { login } from '../../Reducers/Actions';
import { useAuth } from '../Routes/Context';
import { Link } from 'react-router-dom';

import './Login.css';

const { Content } = Layout;

const Login = () => {
  const recaptchaRef = React.createRef();
  const [isLoading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const { setAuthTokens } = useAuth();
  const loginFinish = res => {
    if (res.accessToken) {
      setAuthTokens(res);
    } else {
      Swal.fire('Thông báo', 'Sai mật khẩu', 'error');
      setLoading(false);
    }
  };
  const loginClick = val => {
    if (expired) {
      setLoading(!isLoading);
      login(val.username, val.password, loginFinish);
    } else {
      Swal.fire("Cảnh Báo", "Vui Lòng Chọn CAPTCHA", "warning");
    }
  };
const onChange= value => {
  if (value){
    setExpired(true);
  }
}
  return (
    <Layout className="site-layout">
      <Content>
        <Row>
          <Col className="col-login" span={24} style={{ display: 'flex' }}>
            <Form className="login-form" name="basic" onFinish={loginClick}>
              <div style={{ textAlign: 'center', marginBottom: 50 }}>
                <img alt="" src="sblogo.png" style={{ width: '150px' }} />

                <h3
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 10,
                    borderRadius:4,
                    color: 'rgba(0, 0, 0, 0.8)'
                  }}
                >
                  ĐĂNG NHẬP
                </h3>
              </div>
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Trống' }]}
              >
                <Input
                  name="username"
                  placeholder="Số tài khoản"
                  prefix={
                    
                    <NumberOutlined
                      type="lock"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Trống' }]}
              >
                <Input.Password
                  name="password"
                  placeholder="Mã pin"
                  prefix={
                    <LockOutlined
                      type="lock"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                />
              </Form.Item>
              <Form.Item>
              <ReCAPTCHA
                sitekey="6LdINvkUAAAAAN9CvIIMrusWuZcIcYzEOtK7x6fs"
                onChange={onChange}
                ref={recaptchaRef}
              />
              </Form.Item>
              <Link to="/forgot-password"><span>Quên mật khẩu ?</span></Link>
              <Form.Item>
                <Button
                  className="custom-button"
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  style={{ float: 'right', margin: 0 }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Login;
