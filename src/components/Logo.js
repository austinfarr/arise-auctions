import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="https://www.ariseafrica.org/wp-content/uploads/2020/04/arise-logo-color.png"
        alt="Arise Auctions Logo"
        width={45}
        height={45}
        priority={true}
      />
    </Link>
  );
};

export default Logo;
