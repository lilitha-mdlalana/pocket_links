import * as Yup from "yup";

export const createLinkValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Site name must be at least 2 characters")
    .max(50, "Site name cannot exceed 50 characters")
    .required("Site name is required"),
  url: Yup.string().url("Invalid URL format").required("URL is required"),
  description: Yup.string()
    .max(200, "Description cannot exceed 200 characters")
    .required("Description is required"),
});
