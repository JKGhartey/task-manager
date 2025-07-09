import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
}

export function SEO({
  title = "TaskManager - Boost Your Team's Productivity | AI-Powered Task Management",
  description = "Streamline your workflow and boost productivity with our intuitive task management platform. 10,000+ teams trust us to manage their most important work. Free forever.",
  keywords = "task management, project management, team collaboration, productivity tools, workflow automation, task tracking, team management, project planning, work management, task organization",
  image = "/logo.jpg",
  url = "https://taskmanager.com",
  type = "website",
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update primary meta tags
    updateMetaTag("title", title);
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow");

    // Update Open Graph tags
    updatePropertyTag("og:title", title);
    updatePropertyTag("og:description", description);
    updatePropertyTag("og:image", `${url}${image}`);
    updatePropertyTag("og:url", url);
    updatePropertyTag("og:type", type);

    // Update Twitter Card tags
    updatePropertyTag("twitter:title", title);
    updatePropertyTag("twitter:description", description);
    updatePropertyTag("twitter:image", `${url}${image}`);
    updatePropertyTag("twitter:url", url);

    // Update canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, keywords, image, url, type, noindex]);

  return null; // This component doesn't render anything
}
