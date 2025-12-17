import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card, Form, Select, Button, Space, Table, InputNumber,
    message, Typography, Row, Col
} from 'antd';
import {
    ArrowLeftOutlined, PlusOutlined, DeleteOutlined, SaveOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { customerService } from '../services/customer.service';
import { salesService } from '../services/sales.service';
import { inventoryService } from '../services/inventory.service';
import type { Customer, Product } from '../types';

const { Title } = Typography;

interface OrderItem {
    key: string;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total: number;
}

export default function CreateOrderPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await customerService.getAll(1, 100);
            if (response.success && response.data) {
                setCustomers(response.data.customers || []);
            }
        } catch (error) {
            console.error('Failed to fetch customers');
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

    const handleAddItem = () => {
        const values = form.getFieldsValue();
        if (!values.product_id || !values.quantity) {
            message.warning('الرجاء اختيار المنتج والكمية');
            return;
        }

        const product = products.find(p => p.id === values.product_id);
        if (!product) return;

        const newItem: OrderItem = {
            key: Date.now().toString(),
            product_id: product.id,
            product_name: product.name,
            quantity: values.quantity,
            unit_price: product.selling_price,
            total: values.quantity * product.selling_price,
        };

        setOrderItems([...orderItems, newItem]);
        form.setFieldsValue({ product_id: undefined, quantity: 1 });
    };

    const handleRemoveItem = (key: string) => {
        setOrderItems(orderItems.filter(item => item.key !== key));
    };

    const handleSubmit = async () => {
        if (!selectedCustomer) {
            message.error('الرجاء اختيار العميل');
            return;
        }

        if (orderItems.length === 0) {
            message.error('الرجاء إضافة منتج واحد على الأقل');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                customer_id: selectedCustomer,
                items: orderItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                })),
            };

            await salesService.create(orderData as any);
            message.success('تم إنشاء الطلب بنجاح');
            navigate('/sales');
        } catch (error) {
            message.error('فشل إنشاء الطلب');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<OrderItem> = [
        {
            title: '#',
            key: 'index',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'المنتج',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'الكمية',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (qty) => <strong>{qty}</strong>,
        },
        {
            title: 'سعر الوحدة',
            dataIndex: 'unit_price',
            key: 'unit_price',
            render: (price) => `${price.toLocaleString()} جنيه`,
        },
        {
            title: 'الإجمالي',
            dataIndex: 'total',
            key: 'total',
            render: (total) => (
                <strong style={{ color: '#52c41a', fontSize: 15 }}>
                    {total.toLocaleString()} جنيه
                </strong>
            ),
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.key)}
                />
            ),
        },
    ];

    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

    return (
        <div>
            <Space style={{ marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/sales')}>
                    رجوع للمبيعات
                </Button>
            </Space>

            <Title level={2} style={{ marginBottom: 24 }}>إنشاء طلب جديد</Title>

            <Row gutter={[16, 16]}>
                {/* Customer Selection */}
                <Col span={24}>
                    <Card title="معلومات العميل">
                        <Form layout="vertical">
                            <Form.Item label="العميل" required>
                                <Select
                                    size="large"
                                    placeholder="اختر العميل"
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={customers.map(c => ({
                                        value: c.id,
                                        label: `${c.name} (${c.code})`,
                                    }))}
                                    onChange={setSelectedCustomer}
                                />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Add Items */}
                <Col span={24}>
                    <Card title="إضافة منتجات">
                        <Form form={form} layout="inline">
                            <Form.Item name="product_id" label="المنتج" style={{ width: 300 }}>
                                <Select
                                    size="large"
                                    placeholder="اختر المنتج"
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={products.map(p => ({
                                        value: p.id,
                                        label: `${p.name} (${p.selling_price} جنيه)`,
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item name="quantity" label="الكمية" initialValue={1}>
                                <InputNumber size="large" min={1} style={{ width: 120 }} />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddItem}
                                    size="large"
                                >
                                    إضافة
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Order Items Table */}
                <Col span={24}>
                    <Card title="أصناف الطلب">
                        <Table
                            columns={columns}
                            dataSource={orderItems}
                            pagination={false}
                            locale={{ emptyText: 'لا توجد أصناف' }}
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row style={{ background: '#fafafa' }}>
                                        <Table.Summary.Cell index={0} colSpan={4} align="right">
                                            <strong style={{ fontSize: 16 }}>الإجمالي الكلي:</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} colSpan={2}>
                                            <strong style={{ fontSize: 18, color: '#52c41a' }}>
                                                {totalAmount.toLocaleString()} جنيه
                                            </strong>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                    </Card>
                </Col>

                {/* Actions */}
                <Col span={24}>
                    <Card>
                        <Space size="middle">
                            <Button
                                type="primary"
                                size="large"
                                icon={<SaveOutlined />}
                                onClick={handleSubmit}
                                loading={loading}
                                disabled={!selectedCustomer || orderItems.length === 0}
                            >
                                حفظ الطلب
                            </Button>
                            <Button size="large" onClick={() => navigate('/sales')}>
                                إلغاء
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
