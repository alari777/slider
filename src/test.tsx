interface FormField {
    name: string;
    label: string;
    type: string;
    componentType: 'TextField' | 'Select';
    rules: any;  // Используйте более конкретный тип, если известны правила валидации
    options?: { value: string; label: string }[];  // Опциональное свойство для селекторов
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

interface FormFieldsConfig {
    fields: FormField[];
}

import React from 'react';
import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

// Типизация для данных формы
type FormData = FieldValues;

function DynamicForm() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = data => {
        console.log(data);
    };

    const formFields: FormField[] = [
        {
            name: 'username',
            label: 'Username',
            type: 'text',
            componentType: 'TextField',
            rules: { required: 'Username is required' }
        },
        {
            name: 'role',
            label: 'Role',
            type: 'select',
            componentType: 'Select',
            options: [
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
                { value: 'guest', label: 'Guest' }
            ],
            rules: { required: 'Role is required' }
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            componentType: 'TextField',
            rules: { required: 'Password is required' }
        }
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {formFields.map((field, index) => (
                <Controller
                    key={index}
                    name={field.name}
                    control={control}
                    rules={field.rules}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <FormControl fullWidth error={!!errors[field.name]}>
                            {field.componentType === 'TextField' && (
                                <TextField
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    label={field.label}
                                    type={field.type}
                                    helperText={errors[field.name]?.message}
                                    fullWidth
                                />
                            )}
                            {field.componentType === 'Select' && (
                                <div>
                                    <InputLabel>{field.label}</InputLabel>
                                    <Select
                                        label={field.label}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                    >
                                        {field.options?.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            )}
                        </FormControl>
                    )}
                />
            ))}
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </form>
    );
}

export default DynamicForm;
