import TestGemini from "@/components/testGemeni/page";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Hello World</p>
      <TestGemini/>
      <Link href={'/camera'}>Camera Page</Link>
    </div>
  );
}
