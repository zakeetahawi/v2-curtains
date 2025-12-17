import { Row, Col, Card, Statistic, Typography } from 'antd';
import {
    DollarOutlined,
    UserOutlined,
    ShoppingOutlined,
    RiseOutlined,
    FallOutlined,
} from '@ant-design/icons';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const { Title } = Typography;

export default function DashboardPage() {
    // Mock data for charts
    const salesData = [
        { month: 'يناير', sales: 45000, orders: 120 },
        { month: 'فبراير', sales: 52000, orders: 145 },
        { month: 'مارس', sales: 48000, orders: 132 },
        { month: 'أبريل', sales: 61000, orders: 168 },
        { month: 'مايو', sales: 55000, orders: 152 },
        { month: 'يونيو', sales: 67000, orders: 189 },
    ];

    const categoryData = [
        { name: 'إلكترونيات', value: 35 },
        { name: 'ملابس', value: 25 },
        { name: 'أدوات', value: 20 },
        { name: 'أخرى', value: 20 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const recentActivities = [
        { id: 1, action: 'طلب جديد', customer: 'أحمد محمد', time: 'منذ 5 دقائق' },
        { id: 2, action: 'دفعة مستلمة', customer: 'فاطمة علي', time: 'منذ 15 دقيقة' },
        { id: 3, action: 'عميل جديد', customer: 'محمد حسن', time: 'منذ 30 دقيقة' },
        { id: 4, action: 'طلب مكتمل', customer: 'سارة أحمد', time: 'منذ ساعة' },
    ];

    return (
        <div>
            <Title level={2} style={{ marginBottom: 24 }}>لوحة التحكم</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="إجمالي المبيعات"
                            value={245000}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                        />
                        <div style={{ marginTop: 8, color: '#3f8600' }}>
                            <RiseOutlined /> 12.5% عن الشهر الماضي
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="عملاء جدد"
                            value={156}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<UserOutlined />}
                        />
                        <div style={{ marginTop: 8, color: '#1890ff' }}>
                            <RiseOutlined /> 8.2% عن الشهر الماضي
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="طلبات نشطة"
                            value={89}
                            valueStyle={{ color: '#faad14' }}
                            prefix={<ShoppingOutlined />}
                        />
                        <div style={{ marginTop: 8, color: '#cf1322' }}>
                            <FallOutlined /> 3.1% عن الشهر الماضي
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="إجمالي الإيرادات"
                            value={1200000}
                            precision={2}
                            valueStyle={{ color: '#722ed1' }}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                        />
                        <div style={{ marginTop: 8, color: '#722ed1' }}>
                            <RiseOutlined /> 15.3% عن الشهر الماضي
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="إحصائيات المبيعات الشهرية">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#1890ff"
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    name="المبيعات (جنيه)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="توزيع المبيعات حسب الفئة">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="مقارنة الطلبات الشهرية">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orders" fill="#52c41a" name="عدد الطلبات" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="أحدث الأنشطة">
                        <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                            {recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    style={{
                                        padding: '12px 0',
                                        borderBottom: '1px solid #f0f0f0',
                                    }}
                                >
                                    <div style={{ fontWeight: 500 }}>{activity.action}</div>
                                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                                        {activity.customer} • {activity.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
