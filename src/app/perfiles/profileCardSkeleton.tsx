import { Card, Flex, Grid } from "@radix-ui/themes";

export default function ProfileCardSkeleton() {
  return (
    <Card className="w-full h-96 bg-card/80 border-0 p-4">
      <Flex direction="column" gap="3" className="h-full">
        <Grid gap="3" columns={{ initial: "1", md: "2" }}>
          <div className="w-full h-32 md:h-40 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>
          <div className="w-full h-24 md:h-40 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>

          <Flex direction="column" gap="2">
            <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>
            <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>
          </Flex>
        </Grid>

        <div className="w-full h-52 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>

        {/* Buttons/Actions at the bottom */}
        <Flex justify="between" gap="2" mt="auto">
          <div className="w-full h-10 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>
          <div className="w-full h-10 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>
        </Flex>
      </Flex>
    </Card>
  );
}
