import { NextPage } from "next";
import Dashboard from "../../../components/Dashboard";
import { Typography, Button, Box } from "@mui/material";
import Link from "next/link";

const Categories: NextPage = () => {
	return (
		<Dashboard>
			<Box>
				<Typography>categories</Typography>
				<Button
					variant="outlined"
					LinkComponent={Link}
					href="/dashboard/categories/create/"
				>
					add new
				</Button>
			</Box>
		</Dashboard>
	);
};

export default Categories;
