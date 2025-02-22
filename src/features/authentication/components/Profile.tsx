/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomLogoutIcon from "../../../components/icon/CustomLogoutIcon";
import CustomPenIcon from "../../../components/icon/CustomPenIcon";
import { UserOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { Button, Card, Flex, Image, Typography, Menu, Col } from "antd";
import useAuthStore from "../hooks/useAuthStore";
import ProfileChangePassword from "./ProfileChangePassword";
import ProfileInformation from "./ProfileInformation";
import CustomPasswordIcon from "../../../components/icon/CustomPasswordIcon";

const { Text, Title } = Typography;

export default function Profile() {
  const { user, logout } = useAuthStore();

  const uploadAvatarRef = useRef<Record<string, any>>(null);

  const [selectedKeys, setSelectedKeys] = useState(["profile-information"]);

  const items = [
    {
      label: "Thông tin cá nhân",
      key: "profile-information",
      icon: <UserOutlined />,
    },
    {
      label: "Đổi mật khẩu",
      key: "profile-change-password",
      icon: <CustomPasswordIcon />,
    },
    {
      label: "Đăng xuất",
      key: "profile-logout",
      icon: <CustomLogoutIcon />,
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <>
      <Flex className="gap-8">
        <Flex className="h-fit">
          <Card className="w-96 bg-light-f9fafb">
            <Flex className="flex-col gap-4">
              <Flex className="gap-4">
                <Flex>
                  <div>
                    <div className="relative">
                      <Image
                        className="h-16 w-16"
                        src={
                          // user?.image ||
                          "https://joesch.moe/api/v1/male/random?key=1"
                        }
                      />
                      <Button
                        icon={<CustomPenIcon />}
                        shape="circle"
                        className="absolute -bottom-1 -right-1 h-6 w-6 min-w-0 p-0"
                        onClick={() => {
                          uploadAvatarRef.current?.open();
                        }}
                      />
                    </div>
                  </div>
                </Flex>
                <Flex className="flex-col gap-2">
                  <Text className="text-xl font-medium">{user?.username}</Text>
                  <Text className="text-sm text-dark-60">
                    {/* {user?.email || ""} */}
                  </Text>
                  <Text className="text-sm text-dark-80">
                    {/* {user?.phoneNumber || ""} */}
                  </Text>
                </Flex>
              </Flex>
              <Menu
                mode="inline"
                className="bg-transparent"
                items={items}
                selectedKeys={selectedKeys}
                onClick={({ key }) => setSelectedKeys([key])}
              />
            </Flex>
          </Card>
        </Flex>
        <Flex className="w-full flex-col gap-4" style={{ padding: "0 24px" }}>
          <>
            {selectedKeys.includes("profile-information") && (
              <Col className="w-full gap-4">
                <Title className="text-xl font-semibold my-0" level={3}>
                  Thông tin cá nhân
                </Title>
                <ProfileInformation />
              </Col>
            )}
            {selectedKeys.includes("profile-change-password") && (
              <Col className="w-full gap-4">
                <Title className="text-xl font-semibold my-0" level={3}>
                  Đổi mật khẩu
                </Title>
                <ProfileChangePassword />
              </Col>
            )}
          </>
        </Flex>
      </Flex>
    </>
  );
}
