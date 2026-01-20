import * as Progress from "@radix-ui/react-progress";

const ProgressBar = ({ value }: { value: number }) => (
  <Progress.Root
    className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
    value={value}
  >
    <Progress.Indicator
      className="h-full w-full bg-green-500 transition-transform duration-500 ease-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </Progress.Root>
);

export default ProgressBar;
