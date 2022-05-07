import { createClient, SupabaseClient } from "@supabase/supabase-js";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const digitalSupport = () => {
	return <></>;
};

export const getServerSideProps = async () => {
	const { data: digital_support, error } = await supabase.from("digital_support").select("*");
	if (error) {
	}
	return { props: { digital_support } };
};

export default digitalSupport;
