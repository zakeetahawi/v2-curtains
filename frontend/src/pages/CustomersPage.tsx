import { useState, useEffect } from 'react';
import { Button, Space, Tag, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../services/customer.service';
import type { Customer } from '../types';
import { DataTable } from '../components/DataTable';
import { FormModal, Form, Input, Select, Switch, Row, Col } from '../components/FormModal';

const { Title } = Typography;
const { Option } = Select;

export default function CustomersPage() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCustomers();
    }, [page, search]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await customerService.getAll(page, 10, search);
            if (response.success && response.data) {
                setCustomers(response.data.customers || []);
                setTotal(response.data.total || 0);
            }
        } catch (error) {
            message.error('فشل تحميل العملاء');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCustomer(null);
        form.resetFields();
        form.setFieldsValue({ is_whatsapp_enabled: true, type: 'regular' });
        setModalVisible(true);
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        form.setFieldsValue(customer);
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await customerService.delete(id);
            message.success('تم حذف العميل بنجاح');
            fetchCustomers();
        } catch (error) {
            message.error('فشل حذف العميل');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingCustomer) {
                await customerService.update(editingCustomer.id, values);
                message.success('تم تحديث العميل بنجاح');
            } else {
                await customerService.create(values);
                message.success('تم إضافة العميل بنجاح');
            }
            setModalVisible(false);
            fetchCustomers();
        } catch (error) {
            message.error('فشل حفظ العميل');
        }
    };

    const columns: ColumnsType<Customer> = [
        {
            title: 'الكود',
            dataIndex: 'code',
            key: 'code',
            width: 100,
            render: (code) => <strong style={{ color: '#1890ff' }}>{code}</strong>,
        },
        {
            title: 'الاسم',
            dataIndex: 'name',
            key: 'name',
            render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
        },
        {
            title: 'الهاتف',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => phone || '-',
        },
        {
            title: 'البريد الإلكتروني',
            dataIndex: 'email',
            key: 'email',
            render: (email) => email || '-',
        },
        {
            title: 'النوع',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const colors: Record<string, string> = {
                    regular: 'default',
                    vip: 'gold',
                    wholesale: 'blue',
                };
                const labels: Record<string, string> = {
                    regular: 'عادي',
                    vip: 'VIP',
                    wholesale: 'جملة',
                };
                return (
                    <Tag color={colors[type]} style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6 }}>
                        {labels[type] || type}
                    </Tag>
                );
            },
        },
        {
            title: 'الحالة',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    color={status === 'active' ? 'success' : 'error'}
                    style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6, fontWeight: 500 }}
                >
                    {status === 'active' ? 'نشط' : 'غير نشط'}
                </Tag>
            ),
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/customers/${record.id}`)}
                        style={{ color: '#1890ff' }}
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ color: '#52c41a' }}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>إدارة العملاء</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                >
                    إضافة عميل جديد
                </Button>
            </div>

            <DataTable
                columns={columns}
                dataSource={customers}
                rowKey="id"
                loading={loading}
                onSearch={setSearch}
                onRefresh={fetchCustomers}
                searchPlaceholder="بحث عن عميل..."
                pagination={{
                    current: page,
                    total,
                    pageSize: 10,
                    onChange: setPage,
                }}
            />

            <FormModal
                title={editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSubmit}
                form={form}
                width={900}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="اسم العميل"
                            rules={[{ required: true, message: 'الرجاء إدخال اسم العميل' }]}
                        >
                            <Input placeholder="مثال: أحمد محمد" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="البريد الإلكتروني"
                            rules={[{ type: 'email', message: 'البريد الإلكتروني غير صحيح' }]}
                        >
                            <Input dir="ltr" placeholder="example@email.com" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="phone" label="الهاتف">
                            <Input dir="ltr" placeholder="+20 123 456 7890" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="mobile" label="الجوال">
                            <Input dir="ltr" placeholder="+20 123 456 7890" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="address" label="العنوان">
                            <Input.TextArea rows={2} placeholder="العنوان التفصيلي" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="city" label="المدينة">
                            <Input placeholder="القاهرة" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="governorate" label="المحافظة">
                            <Input placeholder="القاهرة" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="country" label="الدولة">
                            <Input placeholder="مصر" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="type" label="نوع العميل">
                            <Select placeholder="اختر النوع">
                                <Option value="regular">عادي</Option>
                                <Option value="vip">VIP</Option>
                                <Option value="wholesale">جملة</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="credit_limit" label="الحد الائتماني">
                            <Input type="number" placeholder="0" suffix="جنيه" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="is_whatsapp_enabled" label="تفعيل إشعارات الواتساب" valuePropName="checked">
                            <Switch checkedChildren="مفعل" unCheckedChildren="معطل" />
                        </Form.Item>
                    </Col>
                </Row>
            </FormModal>
        </div>
    );
}
