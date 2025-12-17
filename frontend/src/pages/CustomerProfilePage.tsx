import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card, Descriptions, Button, Space, Tabs, Table, Tag,
    Modal, Form, Input, Select, Upload, message, Typography
} from 'antd';
import {
    ArrowLeftOutlined, EditOutlined, WhatsAppOutlined,
    EnvironmentOutlined, UploadOutlined, PlusOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { customerService } from '../services/customer.service';
import type { Customer, CustomerActivity, CustomerDocument } from '../types';

const { Title, Text } = Typography;

export default function CustomerProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [activities, setActivities] = useState<CustomerActivity[]>([]);
    const [documents, setDocuments] = useState<CustomerDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [activityModalVisible, setActivityModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (id) {
            fetchCustomer();
            fetchActivities();
            fetchDocuments();
        }
    }, [id]);

    const fetchCustomer = async () => {
        setLoading(true);
        try {
            const response = await customerService.getOne(Number(id));
            if (response.success && response.data) {
                setCustomer(response.data);
            }
        } catch (error) {
            message.error('فشل تحميل بيانات العميل');
        } finally {
            setLoading(false);
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await customerService.getActivities(Number(id));
            if (response.success && response.data) {
                setActivities(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch activities');
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await customerService.getDocuments(Number(id));
            if (response.success && response.data) {
                setDocuments(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch documents');
        }
    };

    const handleAddActivity = async (values: any) => {
        try {
            await customerService.addActivity(Number(id), values);
            message.success('تم إضافة النشاط بنجاح');
            setActivityModalVisible(false);
            form.resetFields();
            fetchActivities();
        } catch (error) {
            message.error('فشل إضافة النشاط');
        }
    };

    const handleUploadDocument = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);

        try {
            await customerService.uploadDocument(Number(id), formData);
            message.success('تم رفع المستند بنجاح');
            fetchDocuments();
        } catch (error) {
            message.error('فشل رفع المستند');
        }
        return false;
    };

    const activityColumns: ColumnsType<CustomerActivity> = [
        {
            title: 'النوع',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const colors: Record<string, string> = {
                    note: 'blue',
                    call: 'green',
                    meeting: 'purple',
                    alert: 'red',
                    reminder: 'orange',
                };
                return <Tag color={colors[type]}>{type}</Tag>;
            },
        },
        {
            title: 'الوصف',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'التاريخ',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => dayjs(date).format('YYYY/MM/DD HH:mm'),
        },
    ];

    const documentColumns: ColumnsType<CustomerDocument> = [
        {
            title: 'العنوان',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'النوع',
            dataIndex: 'file_type',
            key: 'file_type',
            render: (type) => <Tag>{type}</Tag>,
        },
        {
            title: 'تاريخ الرفع',
            dataIndex: 'uploaded_at',
            key: 'uploaded_at',
            render: (date) => dayjs(date).format('YYYY/MM/DD'),
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => window.open(`http://localhost:8080${record.file_path}`, '_blank')}
                >
                    عرض
                </Button>
            ),
        },
    ];

    if (!customer) {
        return <div>جاري التحميل...</div>;
    }

    return (
        <div>
            <Space style={{ marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/customers')}>
                    رجوع
                </Button>
            </Space>

            <Card loading={loading}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                        <Title level={2}>{customer.name}</Title>
                        <Text type="secondary">{customer.code}</Text>
                    </div>
                    <Space>
                        {customer.phone && (
                            <Button
                                icon={<WhatsAppOutlined />}
                                type="primary"
                                style={{ background: '#25D366' }}
                                onClick={() => window.open(`https://wa.me/${customer.phone}`, '_blank')}
                            >
                                واتساب
                            </Button>
                        )}
                        {customer.address && (
                            <Button
                                icon={<EnvironmentOutlined />}
                                onClick={() => window.open(`https://maps.google.com/?q=${customer.address}`, '_blank')}
                            >
                                الموقع
                            </Button>
                        )}
                        <Button icon={<EditOutlined />}>تعديل</Button>
                    </Space>
                </div>

                <Tabs
                    defaultActiveKey="info"
                    items={[
                        {
                            key: 'info',
                            label: 'المعلومات الأساسية',
                            children: (
                                <Descriptions bordered column={2}>
                                    <Descriptions.Item label="البريد الإلكتروني">{customer.email || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="الهاتف">{customer.phone || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="الجوال">{customer.mobile || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="المدينة">{customer.city || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="العنوان" span={2}>{customer.address || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="النوع">
                                        <Tag color={customer.type === 'vip' ? 'gold' : 'default'}>{customer.type}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="الحالة">
                                        <Tag color={customer.status === 'active' ? 'green' : 'red'}>
                                            {customer.status === 'active' ? 'نشط' : 'غير نشط'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="الحد الائتماني">{customer.credit_limit} جنيه</Descriptions.Item>
                                    <Descriptions.Item label="الرصيد">{customer.balance} جنيه</Descriptions.Item>
                                    <Descriptions.Item label="إشعارات الواتساب">
                                        <Tag color={customer.is_whatsapp_enabled ? 'green' : 'red'}>
                                            {customer.is_whatsapp_enabled ? 'مفعل' : 'معطل'}
                                        </Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            )
                        },
                        {
                            key: 'activities',
                            label: 'سجل الأنشطة',
                            children: (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => setActivityModalVisible(true)}
                                        style={{ marginBottom: 16 }}
                                    >
                                        إضافة نشاط
                                    </Button>
                                    <Table
                                        columns={activityColumns}
                                        dataSource={activities}
                                        rowKey="id"
                                        pagination={false}
                                    />
                                </>
                            )
                        },
                        {
                            key: 'documents',
                            label: 'المستندات',
                            children: (
                                <>
                                    <Upload beforeUpload={handleUploadDocument} showUploadList={false}>
                                        <Button icon={<UploadOutlined />} style={{ marginBottom: 16 }}>
                                            رفع مستند
                                        </Button>
                                    </Upload>
                                    <Table
                                        columns={documentColumns}
                                        dataSource={documents}
                                        rowKey="id"
                                        pagination={false}
                                    />
                                </>
                            )
                        }
                    ]}
                />
            </Card>

            <Modal
                title="إضافة نشاط جديد"
                open={activityModalVisible}
                onCancel={() => setActivityModalVisible(false)}
                onOk={() => form.submit()}
                okText="حفظ"
                cancelText="إلغاء"
            >
                <Form form={form} layout="vertical" onFinish={handleAddActivity}>
                    <Form.Item name="type" label="النوع" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="note">ملاحظة</Select.Option>
                            <Select.Option value="call">مكالمة</Select.Option>
                            <Select.Option value="meeting">اجتماع</Select.Option>
                            <Select.Option value="alert">تنبيه</Select.Option>
                            <Select.Option value="reminder">تذكير</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="الوصف" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
