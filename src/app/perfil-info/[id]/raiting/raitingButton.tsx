"use client";

import { Flex, Heading, Text } from "@radix-ui/themes";
import { Star } from "lucide-react";
import { useState } from "react";

export default function RaitingCollaborator() {
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <Flex direction="column" gap="2">
      <Heading as="h2" size="4">
        Calificación
      </Heading>

      <Flex align="center" gap="2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              (hoverRating || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-500"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}

        <Text weight="bold">({rating.toFixed(1)} de 5)</Text>
      </Flex>

      <Text as="p" size="2" className="text-muted-foreground">
        Deja tu calificación para ayudar a otros.
      </Text>
    </Flex>
  );
}
