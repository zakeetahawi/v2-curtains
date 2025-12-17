import { useState, useEffect } from 'react';
import { Button, Space, Tag, Progress, Badge, App, Typography } from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    WarningOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { inventoryService } from '../services/inventory.service';
import type { Product } from '../types';
import { DataTable } from '../components/DataTable';
import { FormModal, Form, Input, Row, Col } from '../components/FormModal';

const { Title } = Typography;

export default function InventoryPage() {
    const { message } = App.useApp();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await inventoryService.getAll(page, 10, search);
            if (response.success && response.data) {
                setProducts(response.data.products || []);
                setTotal(response.data.total || 0);
            }
        } catch (error) {
            message.error('فشل تحميل المنتجات');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingProduct(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await inventoryService.delete(id);
            message.success('تم حذف المنتج بنجاح');
            fetchProducts();
        } catch (error) {
            message.error('فشل حذف المنتج');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Convert string inputs to numbers
            const processedValues = {
                ...values,
                cost_price: parseFloat(values.cost_price),
                selling_price: parseFloat(values.selling_price),
                stock_quantity: parseInt(values.stock_quantity),
                min_stock_level: parseInt(values.min_stock_level || '10'),
                reorder_level: parseInt(values.reorder_level || '10'), // Using reorder_level as usually mapped to min_stock_level
                category_id: 1, // Default category for now
            };

            if (editingProduct) {
                await inventoryService.update(editingProduct.id, processedValues);
                message.success('تم تحديث المنتج بنجاح');
            } else {
                await inventoryService.create(processedValues);
                message.success('تم إضافة المنتج بنجاح');
            }
            setModalVisible(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            message.error('فشل حفظ المنتج');
        }
    };

    const getStockStatus = (stock: number, minStock: number) => {
        if (stock === 0) return { color: 'error', text: 'نفذ المخزون', icon: <WarningOutlined /> };
        if (stock <= minStock) return { color: 'warning', text: 'مخزون منخفض', icon: <WarningOutlined /> };
        return { color: 'success', text: 'متوفر', icon: <CheckCircleOutlined /> };
    };

    const columns: ColumnsType<Product> = [
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            width: 120,
            render: (sku) => <strong style={{ color: '#1890ff', fontFamily: 'monospace' }}>{sku}</strong>,
        },
        {
            title: 'اسم المنتج',
            dataIndex: 'name',
            key: 'name',
            render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
        },
        {
            title: 'الفئة',
            dataIndex: ['category', 'name'],
            key: 'category',
            render: (category) => (
                <Tag style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6 }}>
                    {category || 'غير محدد'}
                </Tag>
            ),
        },
        {
            title: 'الكمية المتاحة',
            dataIndex: 'stock_quantity',
            key: 'stock_quantity',
            align: 'center',
            width: 180,
            render: (stock, record) => {
                const percentage = Math.min((stock / ((record.min_stock_level || 10) * 2)) * 100, 100);
                const status = getStockStatus(stock, record.min_stock_level || 0);
                return (
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <div style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: status.color === 'error' ? '#ff4d4f' : status.color === 'warning' ? '#faad14' : '#52c41a'
                        }}>
                            {stock}
                        </div>
                        <Progress
                            percent={percentage}
                            showInfo={false}
                            strokeColor={
                                status.color === 'error' ? '#ff4d4f' :
                                    status.color === 'warning' ? '#faad14' : '#52c41a'
                            }
                            trailColor="#f0f0f0"
                            strokeWidth={8}
                        />
                    </Space>
                );
            },
        },
        {
            title: 'السعر',
            dataIndex: 'selling_price',
            key: 'selling_price',
            render: (price) => (
                <span style={{ fontWeight: 600, color: '#52c41a' }}>
                    {(price || 0).toLocaleString()} جنيه
                </span>
            ),
        },
        {
            title: 'الحالة',
            key: 'status',
            width: 150,
            render: (_, record) => {
                const status = getStockStatus(record.stock_quantity, record.min_stock_level || 0);
                return (
                    <Badge
                        status={status.color as any}
                        text={
                            <Space>
                                {status.icon}
                                <span style={{ fontWeight: 500 }}>{status.text}</span>
                            </Space>
                        }
                    />
                );
            },
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
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
                <Title level={2} style={{ margin: 0 }}>إدارة المخزون</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                >
                    إضافة منتج جديد
                </Button>
            </div>

            <DataTable
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                onSearch={setSearch}
                onRefresh={fetchProducts}
                searchPlaceholder="بحث عن منتج..."
                pagination={{
                    current: page,
                    total,
                    pageSize: 10,
                    onChange: setPage,
                }}
            />

            <FormModal
                title={editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSubmit}
                form={form}
                width={800}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="sku"
                            label="رمز المنتج (SKU)"
                            rules={[{ required: true, message: 'الرجاء إدخال رمز المنتج' }]}
                        >
                            <Input placeholder="PRD-001" dir="ltr" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="اسم المنتج"
                            rules={[{ required: true, message: 'الرجاء إدخال اسم المنتج' }]}
                        >
                            <Input placeholder="مثال: منتج تجريبي" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="description" label="الوصف">
                            <Input.TextArea rows={3} placeholder="وصف تفصيلي للمنتج..." />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="cost_price"
                            label="سعر التكلفة"
                            rules={[{ required: true, message: 'الرجاء إدخال سعر التكلفة' }]}
                        >
                            <Input type="number" placeholder="0" suffix="جنيه" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="selling_price"
                            label="سعر البيع"
                            rules={[{ required: true, message: 'الرجاء إدخال سعر البيع' }]}
                        >
                            <Input type="number" placeholder="0" suffix="جنيه" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="stock_quantity"
                            label="الكمية المتاحة"
                            rules={[{ required: true, message: 'الرجاء إدخال الكمية' }]}
                        >
                            <Input type="number" placeholder="0" suffix="وحدة" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="min_stock_level" label="الحد الأدنى للمخزون">
                            <Input type="number" placeholder="10" suffix="وحدة" />
                        </Form.Item>
                    </Col>
                </Row>
            </FormModal>
        </div>
    );
}
