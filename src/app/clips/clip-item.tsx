'use client';
import { PostData } from "@/types/post";
import { AppUser } from "@/types/user";
import { Avatar, Box, Button, Flex, Text } from "@radix-ui/themes";
import { Heart, MessageCircle, Share2, MoreVertical, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from "@radix-ui/themes/components/skeleton";
import { cn } from "@/lib/utils";

interface ClipItemProps {
    post: PostData;
}

export function ClipItem({ post }: ClipItemProps) {
    const [author, setAuthor] = useState<AppUser | null>(null);
    const [loadingAuthor, setLoadingAuthor] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 1000) + 200); // Dummy number

    // Simulating the "seeking partner" status
    const isSeekingPartner = post.autorId.charCodeAt(5) % 3 === 0;

    useEffect(() => {
        const fetchAuthor = async () => {
            setLoadingAuthor(true);
            if (post.autorId) {
                try {
                    const userDocRef = doc(db, "usuarios", post.autorId);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setAuthor(userDocSnap.data() as AppUser);
                    }
                } catch (error) {
                    console.error("Error fetching author:", error);
                }
            }
            setLoadingAuthor(false);
        };
        fetchAuthor();
    }, [post.autorId]);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    };

    const mediaItems = [...(post.media.images || []), post.media.video].filter(Boolean);

    return (
        <div className="relative h-full w-full bg-black">
            {/* Seeking Partner Badge */}
            {isSeekingPartner && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
                    <HeartHandshake className="h-5 w-5 text-pink-400" />
                    <Text size="1" weight="bold">Busca Pareja</Text>
                </div>
            )}

            {/* Media */}
            <Box className="absolute inset-0 flex items-center justify-center">
                {mediaItems.length > 1 && !post.media.video ? (
                    <Carousel showThumbs={false} showStatus={false} showIndicators={mediaItems.length > 1} infiniteLoop useKeyboardArrows className="h-full w-full">
                        {post.media.images.map((image, index) => (
                            <div key={index} className="h-full flex items-center justify-center bg-black">
                                <img src={image.url} alt={`Post image ${index + 1}`} className="object-contain h-full w-auto" />
                            </div>
                        ))}
                    </Carousel>
                ) : mediaItems[0] ? (
                    post.media.video ? (
                        <video src={post.media.video.url} controls autoPlay loop muted className="h-full w-full object-contain" />
                    ) : (
                         <div className="h-full flex items-center justify-center bg-black">
                            <img src={post.media.images[0].url} alt="Post image" className="object-contain h-full w-auto" />
                        </div>
                    )
                ) : <div className="text-white">No hay contenido para mostrar</div>}
            </Box>

            {/* Overlay with Info & Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                <Flex justify="between" align="end">
                    {/* Left side: User Info & Description */}
                    <Box className="max-w-[calc(100%-60px)]">
                        <Skeleton loading={loadingAuthor}>
                            <Flex align="center" gap="3" mb="2">
                                <Avatar src={author?.foto || undefined} fallback={author?.nombre?.charAt(0) || '?'} radius="full" />
                                <Text weight="bold" className="text-white">{author?.nombre || 'Colaborador'}</Text>
                            </Flex>
                        </Skeleton>
                        <Text as="p" size="2" className="text-white/90 line-clamp-3">{post.descripcion}</Text>
                    </Box>

                    {/* Right side: Action Buttons */}
                    <Flex direction="column" gap="4" align="center" className="text-white">
                        <Button variant="ghost" className="text-white p-0 h-auto flex flex-col items-center" onClick={handleLike}>
                            <Heart size={28} className={cn(isLiked ? 'fill-red-500 text-red-500' : 'text-white')} />
                            <Text size="1">{likeCount > 999 ? `${(likeCount/1000).toFixed(1)}k` : likeCount}</Text>
                        </Button>
                        <Button variant="ghost" className="text-white p-0 h-auto flex flex-col items-center">
                            <MessageCircle size={28} />
                            <Text size="1">345</Text>
                        </Button>
                        <Button variant="ghost" className="text-white p-0 h-auto">
                            <Share2 size={28} />
                        </Button>
                        <Button variant="ghost" className="text-white p-0 h-auto">
                            <MoreVertical size={28} />
                        </Button>
                    </Flex>
                </Flex>
            </div>
        </div>
    );
}
