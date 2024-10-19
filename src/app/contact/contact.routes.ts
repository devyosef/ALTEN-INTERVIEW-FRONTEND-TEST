import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Routes } from "@angular/router";
import { ContactComponent } from "./contact.component";

export const CONTACT_ROUTES: Routes = [
	{
		path: "",
		component: ContactComponent,
	},
	{ path: "**", redirectTo: "list" },
];
