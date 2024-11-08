import { Box, HStack, VStack, Image, Button } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Enemy, useEnemy, usePostEnemy, usePutEnemy } from "../hooks/useEnemy";
import { useState, useEffect } from "react";
import InputFieldElement from "../components/InputFieldElement";

const EnemyUpsert = () => {

    const param = useParams().enemyid;
    const [enemy, setEnemy] = useState<Enemy>({} as Enemy);
    const value = param !== undefined && !isNaN(Number(param)) ? Number(param) : null;


    useEffect(() => {
        const fetchEnemyData = async () => {
            if (value !== null) {
                const enemyData = await useEnemy(value);
                if (enemyData.data) {
                    setEnemy(enemyData.data);
                }
            }
        };
    
        fetchEnemyData();
    }, []);



    const handleUpsert = () => { 
        //TODO: Implement the handleUpsert function in the useEnemies class, this is ass and i cant get it to work
        if (enemy.id === undefined) {
            usePostEnemy(enemy);
        }
        else {
            usePutEnemy(enemy.id, enemy);
        }
    }

    return (
        <Box backgroundColor="white" color="lightgray" py="20px" px="25px" rounded="10px" mt="20px">
            <VStack>
                <HStack spacing='24px'>
                    <Box>
                        <InputFieldElement
                            type="text"
                            name="Name"
                            placeholder="Name"
                            value={enemy.name}
                            onChange={(name) => setEnemy({ ...enemy, name })}
                        />

                        <InputFieldElement
                            type="text"
                            name="Health"
                            placeholder="Health"
                            value={enemy.health.toString()}
                            onChange={(health) => setEnemy({ ...enemy, health: Number(health) })}
                        />

                        <InputFieldElement
                            type="number"
                            name="Cost"
                            placeholder="Cost"
                            value={enemy.cost?.toString()}
                            onChange={(cost) => setEnemy({ ...enemy, cost: Number(cost) })}
                        />

                        <InputFieldElement
                            type="text"
                            name="ImagePath"
                            placeholder="ImagePath"
                            value={enemy.imagePath}
                            onChange={(imagePath) => setEnemy({ ...enemy, imagePath })}
                        />
                    </Box>
                    <Box>
                        <Image src="https://loremflickr.com/320/240" border="1px solid black" w="160px" h="160px" />
                        <p>Name: {enemy.name}</p>
                        <p>Health: {enemy.health}</p>
                        <p>Cost: {enemy.cost}</p>
                        <p>Image: {enemy.imagePath}</p>
                    </Box>
                </HStack>
                <Button colorScheme="orange" onClick={handleUpsert}>
                    {param === undefined ? "Create" : "Update"}
                </Button>
                <div>
                    {JSON.stringify(enemy)}
                </div>
            </VStack>
        </Box>
    );
}

export default EnemyUpsert;
