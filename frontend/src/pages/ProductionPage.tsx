import { Card, Typography, Empty, Button } from 'antd';
import { ToolOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function ProductionPage() {
    return (
        <div>
            <Title level={2} style={{ marginBottom: 24 }}>الإنتاج</Title>

            <Card>
                <Empty
                    image={<ToolOutlined style={{ fontSize: 80, color: '#1890ff' }} />}
                    imageStyle={{ height: 100 }}
                    description={
                        <div>
                            <Title level={4}>صفحة الإنتاج قيد التطوير</Title>
                            <Paragraph type="secondary">
                                سيتم إضافة ميزات إدارة الإنتاج قريباً
                            </Paragraph>
                        </div>
                    }
                >
                    <Button type="primary" icon={<PlusOutlined />}>
                        إضافة أمر إنتاج
                    </Button>
                </Empty>
            </Card>
        </div>
    );
}
