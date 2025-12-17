import { useState, useEffect } from 'react';
import { Card, Typography, Table, Button, Tag, Space, Badge, App, Modal, Form, InputNumber, Select, Input, DatePicker } from 'antd';
import { PlusOutlined, PlayCircleOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { productionService } from '../services/production.service';
import { inventoryService } from '../services/inventory.service';
import type { ProductionOrder, Product } from '../types';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

export default function ProductionPage() {
    const { message } = App.useApp();
    const [orders, setOrders] = useState<ProductionOrder[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await productionService.getOrders();
            if (response.success && response.data) {
                setOrders(response.data.orders || []);
            }
        } catch (error) {
            message.error('فشل تحميل أوامر الإنتاج');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await inventoryService.getAll(1, 100);
            if (response.success && response.data) {
                setProducts(response.data.products || []);
            }
        } catch (error) {
            console.error('Failed to fetch products');
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const payload = {
                ...values,
                start_date: values.start_date.toISOString(),
            };

            await productionService.createOrder(payload);
            message.success('تم إنشاء أمر الإنتاج بنجاح');
            setModalVisible(false);
            form.resetFields();
            fetchOrders();
        } catch (error) {
            message.error('فشل إنشاء أمر الإنتاج');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await productionService.updateStatus(id, status);
            message.success('تم تحديث حالة الأمر');
            fetchOrders();
        } catch (error) {
            message.error('فشل تحديث الحالة');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planned': return 'blue';
            case 'in_progress': return 'processing';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'planned': return 'مخطط';
            case 'in_progress': return 'قيد التنفيذ';
            case 'completed': return 'مكتمل';
            case 'cancelled': return 'ملغى';
            default: return status;
        }
    };

    const columns: ColumnsType<ProductionOrder> = [
        {
            title: 'رقم الأمر',
            dataIndex: 'order_number',
            key: 'order_number',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'المنتج',
            dataIndex: ['product', 'name'],
            key: 'product',
        },
        {
            title: 'الكمية',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'تاريخ البدء',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: 'الحالة',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Badge status={getStatusColor(status) as any} text={getStatusText(status)} />
            ),
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'planned' && (
                        <Button
                            size="small"
                            icon={<PlayCircleOutlined />}
                            type="primary"
                            onClick={() => handleStatusUpdate(record.id, 'in_progress')}
                        >
                            بدء
                        </Button>
                    )}
                    {record.status === 'in_progress' && (
                        <Button
                            size="small"
                            icon={<CheckCircleOutlined />}
                            style={{ borderColor: '#52c41a', color: '#52c41a' }}
                            onClick={() => handleStatusUpdate(record.id, 'completed')}
                        >
                            إكمال
                        </Button>
                    )}
                    {['planned', 'in_progress'].includes(record.status) && (
                        <Button
                            size="small"
                            danger
                            icon={<StopOutlined />}
                            onClick={() => handleStatusUpdate(record.id, 'cancelled')}
                        >
                            إلغاء
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>إدارة الإنتاج</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setModalVisible(true)}
                >
                    أمر إنتاج جديد
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'لا توجد أوامر إنتاج' }}
                />
            </Card>

            <Modal
                title="أمر إنتاج جديد"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleCreate}
                confirmLoading={submitting}
                okText="إنشاء"
                cancelText="إلغاء"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="product_id"
                        label="المنتج"
                        rules={[{ required: true, message: 'الرجاء اختيار المنتج' }]}
                    >
                        <Select
                            placeholder="اختر المنتج المراد إنتاجه"
                            showSearch
                            optionFilterProp="children"
                        >
                            {products.map(p => (
                                <Option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="الكمية"
                        rules={[{ required: true, message: 'الرجاء إدخال الكمية' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} placeholder="الكمية المراد إنتاجها" />
                    </Form.Item>

                    <Form.Item
                        name="start_date"
                        label="تاريخ البدء المخطط"
                        rules={[{ required: true, message: 'الرجاء اختيار تاريخ البدء' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="notes" label="ملاحظات">
                        <Input.TextArea rows={3} placeholder="أي ملاحظات إضافية..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
