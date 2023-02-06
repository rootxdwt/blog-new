import styles from "../styles/Home.module.css";
import headerStyles from "../styles/Header.module.css";

export default function Home() {
  return (
    <>
    </>
  );
}
export const getServerSideProps = async (context: any) => {
  return {
    notFound:true
  };
};
