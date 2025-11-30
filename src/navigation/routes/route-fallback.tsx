import LoaderComponent from "@/components/ui/loader";

const RouteFallback = () => {
  return <LoaderComponent loading={true} delay={0} fullscreen={false} />;
};

export default RouteFallback;
