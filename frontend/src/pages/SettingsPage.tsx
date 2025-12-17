import { useState, useEffect } from 'react';
import {
    Card, Form, Input, Button, message, Upload,
    Typography, Row, Col, Select, Tabs, Space, Image
} from 'antd';
import {
    SaveOutlined, UploadOutlined,
    SettingOutlined, WhatsAppOutlined
} from '@ant-design/icons';
import { settingsService } from '../services/settings.service';
import type { SystemSettings } from '../types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function SettingsPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<SystemSettings>({});
    const [logoUrl, setLogoUrl] = useState<string>('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await settingsService.get();
            if (response.success && response.data) {
                setSettings(response.data);
                form.setFieldsValue(response.data);
                if (response.data.company_logo) {
                    setLogoUrl(`http://localhost:8080${response.data.company_logo}`);
                }
            }
        } catch (error) {
            message.error('فشل تحميل الإعدادات');
        }
    };

    const handleSave = async (values: SystemSettings) => {
        setLoading(true);
        try {
            const response = await settingsService.update(values);
            if (response.success) {
                message.success('تم حفظ الإعدادات بنجاح');
                fetchSettings();
            }
        } catch (error) {
            message.error('فشل حفظ الإعدادات');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await settingsService.uploadLogo(formData);
            if (response.success) {
                message.success('تم رفع الشعار بنجاح');
                fetchSettings();
            }
        } catch (error) {
            message.error('فشل رفع الشعار');
        }
        return false; // Prevent default upload behavior
    };

    return (
        <div>
            <Title level={2} style={{ marginBottom: 24 }}>الإعدادات</Title>

            <Tabs defaultActiveKey="general" size="large">
                <TabPane
                    tab={
                        <span>
                            <SettingOutlined />
                            الإعدادات العامة
                        </span>
                    }
                    key="general"
                >
                    <Card>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSave}
                            initialValues={settings}
                        >
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Title level={4}>معلومات الشركة</Title>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="company_name"
                                        label="اسم الشركة"
                                        rules={[{ required: true, message: 'الرجاء إدخال اسم الشركة' }]}
                                    >
                                        <Input size="large" placeholder="مثال: شركة التقنية المتقدمة" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item name="currency" label="العملة الافتراضية">
                                        <Select size="large">
                                            <Select.Option value="EGP">جنيه مصري (EGP)</Select.Option>
                                            <Select.Option value="SAR">ريال سعودي (SAR)</Select.Option>
                                            <Select.Option value="USD">دولار أمريكي (USD)</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item label="شعار الشركة">
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {logoUrl && (
                                                <Image
                                                    src={logoUrl}
                                                    alt="Company Logo"
                                                    style={{ maxWidth: 200, marginBottom: 16 }}
                                                />
                                            )}
                                            <Upload
                                                accept="image/*"
                                                beforeUpload={handleLogoUpload}
                                                showUploadList={false}
                                            >
                                                <Button icon={<UploadOutlined />} size="large">
                                                    رفع شعار جديد
                                                </Button>
                                            </Upload>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                الحجم الموصى به: 200x200 بكسل (PNG, JPG)
                                            </Text>
                                        </Space>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        size="large"
                                        loading={loading}
                                    >
                                        حفظ التغييرات
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <WhatsAppOutlined />
                            تكامل الواتساب
                        </span>
                    }
                    key="whatsapp"
                >
                    <Card>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSave}
                        >
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Title level={4}>إعدادات WhatsApp API</Title>
                                    <Text type="secondary">
                                        قم بإدخال بيانات API الخاصة بك لتفعيل إرسال الرسائل التلقائية
                                    </Text>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="whatsapp_api_url"
                                        label="رابط API"
                                    >
                                        <Input
                                            size="large"
                                            placeholder="https://api.whatsapp-provider.com/send"
                                            dir="ltr"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="whatsapp_api_token"
                                        label="مفتاح API"
                                    >
                                        <Input.Password
                                            size="large"
                                            placeholder="أدخل مفتاح API السري"
                                            dir="ltr"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="whatsapp_sender"
                                        label="رقم المرسل"
                                    >
                                        <Input
                                            size="large"
                                            placeholder="+201xxxxxxxxx"
                                            dir="ltr"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        size="large"
                                        loading={loading}
                                    >
                                        حفظ التغييرات
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
}
