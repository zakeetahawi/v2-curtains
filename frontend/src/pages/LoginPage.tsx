import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAppStore } from '../store';
import type { LoginRequest } from '../types';

const { Title, Text } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useAppStore((state) => state.setUser);

    const onFinish = async (values: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authService.login(values);

            if (response.success && response.data) {
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                message.success('تم تسجيل الدخول بنجاح');
                navigate('/dashboard');
            } else {
                message.error(response.message || 'فشل تسجيل الدخول');
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <Card
                style={{
                    width: 400,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    borderRadius: 12
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>نظام ERP</Title>
                    <Text type="secondary">مرحباً بك، قم بتسجيل الدخول للمتابعة</Text>
                </div>

                <Form
                    name="login"
                    initialValues={{
                        email: 'admin@erp.local',
                        password: 'admin123'
                    }}
                    onFinish={onFinish}
                    size="large"
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        label="البريد الإلكتروني"
                        rules={[
                            { required: true, message: 'الرجاء إدخال البريد الإلكتروني' },
                            { type: 'email', message: 'البريد الإلكتروني غير صحيح' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="admin@erp.local"
                            dir="ltr"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="كلمة المرور"
                        rules={[{ required: true, message: 'الرجاء إدخال كلمة المرور' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="••••••••"
                            dir="ltr"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{ height: 48 }}
                        >
                            تسجيل الدخول
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{
                    marginTop: 16,
                    padding: 12,
                    background: '#f0f2f5',
                    borderRadius: 8,
                    textAlign: 'center'
                }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        🔑 بيانات التجربة: admin@erp.local / admin123
                    </Text>
                </div>
            </Card>
        </div>
    );
}
