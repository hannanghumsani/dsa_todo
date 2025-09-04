import { Col, Row } from "react-bootstrap";
import Dashboard from "@/components/dashboard";
import { getAllSSR } from "@/ApiS/userApi";
import { cookies } from "next/headers";

export default async function Home() {
  const perPage = "-1";
  const page = "1";

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const resp = await getAllSSR(Number(perPage), Number(page), token);

  return (
    <Col className="">
      <Dashboard users={resp?.data} />
    </Col>
  );
}
